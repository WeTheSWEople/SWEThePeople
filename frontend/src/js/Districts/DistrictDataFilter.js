export function cleanIncomeData (response) {
  let income = []
  if (response.income_none !== null) {
    income.push({'name': '0', 'amt': response.income_none})
  }
  if (response.income_9999_less !== null) {
    income.push({'name': '1-10', 'amt': response.income_9999_less})
  }
  if (response.income_10000_14999 !== null) {
    income.push({'name': '10-15', 'amt': response.income_10000_14999})
  }
  if (response.income_15000_19999 !== null) {
    income.push({'name': '15-20', 'amt': response.income_15000_19999})
  }
  if (response.income_20000_24999 !== null) {
    income.push({'name': '20-25', 'amt': response.income_20000_24999})
  }
  if (response.income_25000_29999 !== null) {
    income.push({'name': '25-30', 'amt': response.income_25000_29999})
  }
  if (response.income_30000_34999 !== null) {
    income.push({'name': '30-35', 'amt': response.income_30000_34999})
  }
  if (response.income_35000_39999 !== null) {
    income.push({'name': '35-40', 'amt': response.income_35000_39999})
  }
  if (response.income_40000_44999 !== null) {
    income.push({'name': '40-45', 'amt': response.income_40000_44999})
  }
  if (response.income_45000_49999 !== null) {
    income.push({'name': '45-50', 'amt': response.income_45000_49999})
  }
  if (response.income_50000_59999 !== null) {
    income.push({'name': '50-60', 'amt': response.income_50000_59999})
  }
  if (response.income_60000_74999 !== null) {
    income.push({'name': '60-75', 'amt': response.income_60000_74999})
  }
  if (response.income_75000_99999 !== null) {
    income.push({'name': '75-100', 'amt': response.income_75000_99999})
  }
  if (response.income_100000_124999 !== null) {
    income.push({'name': '100-125', 'amt': response.income_100000_124999})
  }
  if (response.income_125000_149999 !== null) {
    income.push({'name': '125-150', 'amt': response.income_125000_149999})
  }
  if (response.income_150000_199999 !== null) {
    income.push({'name': '150-200', 'amt': response.income_150000_199999})
  }
  if (response.income_200000_more !== null) {
    income.push({'name': '>200', 'amt': response.income_200000_more})
  }
  return income
}

export function cleanEducationData (response) {
  let education = []
  if (response.education_less_than_hs !== null) {
    education.push({
      'name': 'Less than high school',
      'amt': response.education_less_than_hs
    })
  }
  if (response.education_hs_grad !== null) {
    education.push({
      'name': 'High school',
      'amt': response.education_hs_grad
    })
  }
  if (response.education_some_college !== null) {
    education.push({
      'name': 'Some college',
      'amt': response.education_some_college
    })
  }
  if (response.education_bachelors !== null) {
    education.push({
      'name': 'Bachelors degree',
      'amt': response.education_bachelors
    })
  }
  if (response.education_grad_prof !== null) {
    education.push({
      'name': 'Graduate school',
      'amt': response.education_grad_prof
    })
  }
  return education
}

export function cleanEthnicityData (response) {
  let result = []
  let legendTemp = []
  if (response.population_american_indian_and_alaska_native !== null) {
    result.push({
      'name': 'AIAN',
      'amt': response.population_american_indian_and_alaska_native
    })
    legendTemp.push({
      name: 'AIAAN',
      value: 'American Indian And Alaska Native (' +
        response.population_american_indian_and_alaska_native + ')'
    })
  }
  if (response.population_asian !== null) {
    result.push({
      'name': 'A',
      'amt': response.population_asian
    })
    legendTemp.push({
      name: 'A',
      value: 'Asian (' + response.population_asian + ')'
    })
  }
  if (response.population_black_or_african_american !== null) {
    result.push({
      'name': 'BAA',
      'amt': response.population_black_or_african_american
    })
    legendTemp.push({
      name: 'BAA',
      value: 'Black Or African American (' +
        response.population_black_or_african_american + ')'
    })
  }
  if (response.population_native_hawaiian_and_other_pacific_islander !== null) {
    result.push({
      'name': 'NHPI',
      'amt': response.population_native_hawaiian_and_other_pacific_islander})
    legendTemp.push({
      name: 'NHPI',
      value: 'Native Hawaiian And Other Pacific Islander (' +
        response.population_native_hawaiian_and_other_pacific_islander + ')'
    })
  }
  if (response.population_some_other_race !== null) {
    result.push({
      'name': 'SR',
      'amt': response.population_some_other_race
    })
    legendTemp.push({
      name: 'SR',
      value: 'Some Other Race (' + response.population_some_other_race + ')'
    })
  }
  if (response.population_two_or_more_races !== null) {
    result.push({
      'name': 'TR',
      'amt': response.population_two_or_more_races
    })
    legendTemp.push({
      name: 'TR',
      value: 'Two or More Races (' + response.population_two_or_more_races + ')'
    })
  }
  if (response.population_white !== null) {
    result.push({
      'name': 'W',
      'amt': response.population_white
    })
    legendTemp.push({
      name: 'W',
      value: 'White (' + response.population_white + ')'
    })
  }
  if (response.ethnicity_hispanic_or_latino !== null) {
    result.push({
      'name': 'HL',
      'amt': response.ethnicity_hispanic_or_latino
    })
    legendTemp.push({
      name: 'HL',
      value: 'Hispanic or Latino (' +
        response.ethnicity_hispanic_or_latino + ')'
    })
  }
  return [result, legendTemp]
}

export function cleanComputersData (response) {
  let tlit = []
  let cLegendTemp = []
  if (response.computers_has_one_or_more !== null) {
    tlit.push({
      'name': 'One or more',
      'amt': response.computers_has_one_or_more
    })
  }
  if (response.computers_none !== null) {
    tlit.push({
      'name': 'None',
      'amt': response.computers_none
    })
  }
  if (response.computers_has_desktop_laptop !== null) {
    tlit.push({
      'name': 'Desktop/Laptop',
      'amt': response.computers_has_desktop_laptop
    })
    cLegendTemp.push({
      name: 'D/L',
      value: 'Desktops or Laptops (' +
        response.computers_has_desktop_laptop + ')'
    })
  }
  if (response.computers_has_smartphone !== null) {
    tlit.push({
      'name': 'Smartphone',
      'amt': response.computers_has_smartphone
    })
    cLegendTemp.push({
      name: 'S',
      value: 'Smartphones (' + response.computers_has_smartphone + ')'
    })
  }
  if (response.computers_has_tablet !== null) {
    tlit.push({
      'name': 'Tablet',
      'amt': response.computers_has_tablet
    })
    cLegendTemp.push({
      name: 'T',
      value: 'Tablets (' + response.computers_has_tablet + ')'
    })
  }
  if (response.computers_has_other !== null) {
    tlit.push({
      'name': 'Other',
      'amt': response.computers_has_other
    })
    cLegendTemp.push({
      name: 'O',
      value: 'Other (' + response.computers_has_other + ')'
    })
  }
  return [tlit, cLegendTemp]
}

export function cleanInternetData (response) {
  let internet = []
  let iLegendTemp = []
  if (response.internet_has !== null) {
    internet.push({
      'name': 'Has internet',
      'amt': response.internet_has
    })
  }
  if (response.internet_none !== null) {
    internet.push({
      'name': 'Does not have internet',
      'amt': response.internet_none
    })
  }
  if (response.internet_has_dialup !== null) {
    internet.push({
      'name': 'Has dialup',
      'amt': response.internet_has_dialup
    })
    iLegendTemp.push({
      name: 'D',
      value: 'Dialup (' + response.internet_has_dialup + ')'
    })
  }
  if (response.internet_has_broadband !== null) {
    internet.push({
      'name': 'Has broadband',
      'amt': response.internet_has_broadband
    })
    iLegendTemp.push({
      name: 'B',
      value: 'Broadband (' + response.internet_has_broadband + ')'
    })
  }
  if (response.internet_has_cellular_data !== null) {
    internet.push({
      'name': 'Has cellular data',
      'amt': response.internet_has_cellular_data
    })
    iLegendTemp.push({
      name: 'CD',
      value: 'Cellular Data (' + response.internet_has_cellular_data + ')'
    })
  }
  if (response.internet_has_satellite !== null) {
    internet.push({
      'name': 'Has satellite internet',
      'amt': response.internet_has_satellite
    })
    iLegendTemp.push({
      name: 'S',
      value: 'Satellite (' + response.internet_has_satellite + ')'
    })
  }
  return [internet, iLegendTemp]
}
