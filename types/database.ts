// types/database.ts
export interface Company {
  company_id: number
  company_name: string
  industry_sector: string | null
  employee_count: number | null
  annual_revenue: number | null
  headquarters_location: string | null
  created_at: string
  updated_at: string
}

export interface EmissionData {
  emission_id: number
  company_id: number
  reporting_year: number
  reporting_period: string | null
  scope1_total_co2_kg: number | null
  scope1_fuel_combustion: number | null
  scope1_industrial_processes: number | null
  scope1_fugitive_emissions: number | null
  scope2_location_based: number | null
  scope2_market_based: number | null
  electricity_consumption_kwh: number | null
  renewable_energy_percentage: number | null
  scope3_total_co2_kg: number | null
  scope3_purchased_goods: number | null
  scope3_transportation: number | null
  scope3_waste_disposal: number | null
  scope3_business_travel: number | null
  scope3_employee_commuting: number | null
  data_quality_score: number | null
  verification_status: string | null
  created_at: string
}

export interface EnergyConsumption {
  energy_id: number
  company_id: number
  facility_name: string | null
  measurement_date: string
  electricity_total_kwh: number | null
  electricity_renewable_kwh: number | null
  electricity_grid_kwh: number | null
  natural_gas_m3: number | null
  coal_tons: number | null
  fuel_oil_liters: number | null
  solar_generation_kwh: number | null
  wind_generation_kwh: number | null
  energy_intensity_per_unit: number | null
  created_at: string
}

export interface Transportation {
  transport_id: number
  company_id: number
  measurement_date: string
  vehicle_type: string | null
  fuel_type: string | null
  total_distance_km: number | null
  fuel_consumption_liters: number | null
  co2_emissions_kg: number | null
  created_at: string
}

export interface SupplyChain {
  supplier_id: number
  company_id: number
  supplier_name: string
  supplier_location: string | null
  carbon_rating: string | null
  annual_co2_kg: number | null
  created_at: string
}

export interface AIInsight {
  insight_id: number
  company_id: number
  analysis_date: string
  insight_type: string | null
  insight_title: string | null
  insight_description: string | null
  confidence_score: number | null
  potential_co2_reduction_kg: number | null
  estimated_cost_savings: number | null
  implementation_complexity: string | null
  created_at: string
}
