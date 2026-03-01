export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  quality: {
    score: number; // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    completeness: number;
    outlierCount: number;
    totalRows: number;
    validRows: number;
    missingSmCount: number;
    withSmCount: number;
  };
  columnReport: Record<string, { present: boolean; nullCount: number; min?: number; max?: number; mean?: number; outOfRange: number }>;
}

export interface TrainingRow {
  date: string;
  lst: number | null;
  ndvi: number | null;
  rainfall: number | null;
  slope: number | null;
  soil_moisture: number | null;
  twi: number | null;
}

const EXPECTED_COLUMNS = ['date', 'lst', 'ndvi', 'rainfall', 'slope', 'soil_moisture', 'twi'];

const VALID_RANGES: Record<string, [number, number]> = {
  lst: [-30, 70],        // Land Surface Temp (°C)
  ndvi: [-1, 1],         // Normalized Difference Vegetation Index
  rainfall: [0, 1],      // Normalized rainfall (0-1 range from CHIRPS)
  slope: [0, 90],        // Slope degrees
  soil_moisture: [0, 100], // Volumetric %
  twi: [0, 30],          // Topographic Wetness Index
};

export const parseCSV = (text: string): TrainingRow[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().replace(/\s+/g, '_');
  const cols = header.split(',').map(c => c.trim());

  // Find column indices
  const dateIdx = cols.findIndex(c => c.includes('date') || c.includes('month'));
  const lstIdx = cols.findIndex(c => c.includes('lst') || c.includes('land_surface'));
  const ndviIdx = cols.findIndex(c => c === 'ndvi' || c.includes('ndvi'));
  const rainfallIdx = cols.findIndex(c => c.includes('rain'));
  const slopeIdx = cols.findIndex(c => c.includes('slope'));
  const smIdx = cols.findIndex(c => c.includes('soil_moisture') || c === 'sm');
  const twiIdx = cols.findIndex(c => c.includes('twi') || c.includes('topographic'));

  const rows: TrainingRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 3) continue;
    
    const parseVal = (idx: number) => {
      if (idx < 0 || !values[idx] || values[idx].trim() === '' || values[idx].trim().toLowerCase() === 'nan') return null;
      const n = parseFloat(values[idx].trim());
      return isNaN(n) ? null : n;
    };

    rows.push({
      date: dateIdx >= 0 ? values[dateIdx]?.trim() : values[1]?.trim() || '',
      lst: parseVal(lstIdx >= 0 ? lstIdx : 2),
      ndvi: parseVal(ndviIdx >= 0 ? ndviIdx : 3),
      rainfall: parseVal(rainfallIdx >= 0 ? rainfallIdx : 4),
      slope: parseVal(slopeIdx >= 0 ? slopeIdx : 5),
      soil_moisture: parseVal(smIdx >= 0 ? smIdx : 6),
      twi: parseVal(twiIdx >= 0 ? twiIdx : 7),
    });
  }
  return rows;
};

export const validateCSV = (data: TrainingRow[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const columnReport: ValidationResult['columnReport'] = {};

  if (data.length === 0) {
    return {
      isValid: false,
      errors: ['No data rows found in CSV'],
      warnings: [],
      quality: { score: 0, grade: 'F', completeness: 0, outlierCount: 0, totalRows: 0, validRows: 0, missingSmCount: 0, withSmCount: 0 },
      columnReport: {},
    };
  }

  if (data.length < 6) {
    errors.push(`Only ${data.length} rows found. Need at least 6 for meaningful training.`);
  }

  // Check each feature column
  const features = ['lst', 'ndvi', 'rainfall', 'slope', 'soil_moisture', 'twi'] as const;
  let totalOutliers = 0;
  let totalNulls = 0;
  const totalCells = data.length * features.length;

  for (const col of features) {
    const values = data.map(r => r[col]).filter((v): v is number => v != null);
    const nullCount = data.length - values.length;
    totalNulls += nullCount;

    const range = VALID_RANGES[col];
    let outOfRange = 0;
    if (range && values.length > 0) {
      outOfRange = values.filter(v => v < range[0] || v > range[1]).length;
      totalOutliers += outOfRange;
    }

    columnReport[col] = {
      present: values.length > 0,
      nullCount,
      min: values.length > 0 ? Math.min(...values) : undefined,
      max: values.length > 0 ? Math.max(...values) : undefined,
      mean: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : undefined,
      outOfRange,
    };

    if (values.length === 0 && col !== 'soil_moisture') {
      errors.push(`Column "${col}" has no valid values`);
    }

    if (outOfRange > 0) {
      warnings.push(`${col}: ${outOfRange} values outside expected range [${range[0]}, ${range[1]}]`);
    }

    if (nullCount > data.length * 0.5 && col !== 'soil_moisture') {
      warnings.push(`${col}: ${((nullCount / data.length) * 100).toFixed(0)}% missing values`);
    }
  }

  // Date checks
  const dates = data.map(r => r.date).filter(Boolean);
  if (dates.length === 0) {
    errors.push('No valid date values found');
  }

  const withSm = data.filter(r => r.soil_moisture != null).length;
  const withoutSm = data.length - withSm;

  if (withSm === 0) {
    warnings.push('No soil moisture training values. Model will use feature correlations only.');
  }

  if (withSm < 6) {
    warnings.push(`Only ${withSm} training samples with soil moisture. Results may be unreliable.`);
  }

  // Compute quality score
  const completeness = ((totalCells - totalNulls) / totalCells) * 100;
  const outlierPenalty = Math.min(totalOutliers * 2, 30);
  const sizePenalty = data.length < 12 ? 20 : data.length < 24 ? 10 : 0;
  const smPenalty = withSm < 6 ? 20 : withSm < 12 ? 10 : 0;
  const rawScore = Math.max(0, completeness - outlierPenalty - sizePenalty - smPenalty);
  const score = Math.round(rawScore);
  
  const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    quality: {
      score,
      grade,
      completeness: Math.round(completeness),
      outlierCount: totalOutliers,
      totalRows: data.length,
      validRows: data.filter(r => r.lst != null || r.ndvi != null).length,
      missingSmCount: withoutSm,
      withSmCount: withSm,
    },
    columnReport,
  };
};
