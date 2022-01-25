// All info taken from:
// https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/

// C implementation
// https://github.com/weathersource/wgrib2

// European info
// https://apps.ecmwf.int/codes/grib/format/grib2/templates/5/2
// Regulations
// https://apps.ecmwf.int/codes/grib/format/grib2/regulations/

// WMO Information Systems
// https://community.wmo.int/activity-areas/wis

class GRIB2 {

    // Static tables
    static tables = {        
        // Discipline of Processed Data
        "0.0" : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table0-0.shtml
            0 : 'Meteorological Products (see Table 4.1)',
            1: 'Hydrological Products (see Table 4.1)',
            2: 'Land Surface Products (see Table 4.1)',
            3: 'Satellite Remote Sensing Products (formerly Space Products) (see Table 4.1)',
            4: 'Space Weather Products (see Table 4.1)',
            10: 'Oceanographic Products (see Table 4.1)',
            255: 'Missing'
        },
        // GRIB Master Tables Version Number
        "1.0": { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table1-0.shtml
            0: 'Experimental',
            1: 'Version Implemented on 7 November 2001',
            2: 'Version Implemented on 4 November 2003',
            // ...
            24: 'Version Implemented on 06 November 2019',
            255: 'Missing'
        },
        // GRIB Local Tables Version Number
        '1.1': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table1-1.shtml
            0: 'Local tables not used.  Only table entries and templates from the current master table are valid.',
            //'1-254': 'Number of local table version used.',
            255: 'Missing'
        },
        // Significance of Reference Time
        '1.2': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table1-2.shtml
            0: 'Analysis',
            1: 'Start of Forecast',
            2: 'Verifying Time of Forecast',
            3: 'Observation Time',
            //4-191: Reserved,
            //192-254: Reserved for Local Use,
            255: 'Missing'
        },
        // Production Status of Data
        '1.3': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table1-3.shtml
            0: 'Operational Products',
            1: 'Operational Test Products',
            2: 'Research Products',
            3: 'Re-Analysis Products',
            4: 'THORPEX Interactive Grand Global Ensemble (TIGGE)',
            5: 'THORPEX Interactive Grand Global Ensemble (TIGGE) test',
            6: 'S2S Operational Products',
            7: 'S2S Test Products',
            8: 'Uncertainties in ensembles of regional reanalysis project (UERRA)',
            9: 'Uncertainties in ensembles of regional reanalysis project (UERRA) Test',
            //10-191: Reserved
            //192-254: Reserved for Local Use
            255: 'Missing'
        },
        // Type of Data
        '1.4': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table1-4.shtml
            0: 'Analysis Products',
            1: 'Forecast Products',
            2: 'Analysis and Forecast Products',
            3: 'Control Forecast Products',
            4: 'Perturbed Forecast Products',
            5: 'Control and Perturbed Forecast Products',
            6: 'Processed Satellite Observations',
            7: 'Processed Radar Observations',
            8: 'Event Probability',
            //9-191: Reserved
            //192-254: Reserved for Local Use
            192: 'Experimental Products',
            255: 'Missing'
        },
        // Identification Template Number
        '1.5': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table1-5.shtml
            0: 'Calendar Definition',
            1: 'Paleontological Offset',
            2: 'Calendar Definition and Paleontological Offset',
            //3-32767: Reserved
            //32768-65534: Reserved for Local Use
            65535: 'Missing'
        },
        // Type of Calendar
        '1.6': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table1-6.shtml
            0: 'Gregorian',
            1: '360-day',
            2: '365-day (see Note 1)',
            3: 'Proleptic Gregorian (see Note 2)',
            //4-191:	Reserved
            //192-254:	Reserved for Local Use
            255: 'Missing'
        },
        // Source of Grid Definition
        '3.0': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-0.shtml
            0: 'Specified in Code Table 3.1',
            1: 'Predetermined Grid Definition - Defined by Originating Center',
            //2-191: Reserved
            //192-254 Reserved for Local Use
            255: 'A grid definition does not apply to this product.'
        },
        // Grid Definition Template Number
        '3.1': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-1.shtml
            0: 'Latitude/Longitude (See Template 3.0)    Also called Equidistant Cylindrical or Plate Caree',
            1: 'Rotated Latitude/Longitude (See Template 3.1)',
            2: 'Stretched Latitude/Longitude (See Template 3.2)',
            3: 'Rotated and Stretched Latitude/Longitude (See Template 3.3)',
            4: 'Variable Resolution Latitude/longitude (See Template 3.4)',
            5: 'Variable Resolution Rotated Latitude/longitude (See Template 3.5)',
            //6-9: 'Reserved',
            10: 'Mercator (See Template 3.10)',
            11: 'Reserved',
            12: 'Transverse Mercator (See Template 3.12)',
            13: 'Mercator with modelling subdomains definition (See Template 3.13)',
            //14-19: 'Reserved'
            20: 'Polar Stereographic Projection (Can be North or South) (See Template 3.20)',
            //21-22: 'Reserved'
            23: 'Polar Stereographic with modelling subdomains definition (See Template 3.23)',
            //24-29: 'Reserved'
            30: 'Lambert Conformal (Can be Secant, Tangent, Conical, or Bipolar) (See Template 3.30)',
            31: 'Albers Equal Area (See Template 3.31)',
            32: 'Reserved',
            33: 'Lambert conformal with modelling subdomains definition (See Template 3.33)',
            //34-39: 'Reserved'
            40: 'Gaussian Latitude/Longitude (See Template 3.40)',
            41: 'Rotated Gaussian Latitude/Longitude (See Template 3.41)',
            42: 'Stretched Gaussian Latitude/Longitude (See Template 3.42)',
            43: 'Rotated and Stretched Gaussian Latitude/Longitude (See Template 3.43)',
            //44-49: 'Reserved'
            50: 'Spherical Harmonic Coefficients (See Template 3.50)',
            51: 'Rotated Spherical Harmonic Coefficients (See Template 3.51)',
            52: 'Stretched Spherical Harmonic Coefficients (See Template 3.52)',
            53: 'Rotated and Stretched Spherical Harmonic Coefficients (See Template 3.53)',
            //54-59: 'Reserved'
            60: 'Cubed-Sphere Gnomonic (See Template 3.60) Validation',
            61: 'Spectral Mercator with modelling subdomains definition (See Template 3.61)',
            62: 'Spectral Polar Stereographic with modelling subdomains definition (See Template 3.62)',
            63: 'Spectral Lambert conformal with modelling subdomains definition (See Template 3.63)',
            //64-89: 'Reserved'
            90: 'Space View Perspective or Orthographic (See Template 3.90)',
            //91-99: 'Reserved'
            100: 'Triangular Grid Based on an Icosahedron (See Template 3.100)',
            101: 'General Unstructured Grid (see Template 3.101)',
            //102-109: 'Reserved'
            110: 'Equatorial Azimuthal Equidistant Projection (See Template 3.110)',
            //111-119: 'Reserved'
            120: 'Azimuth-Range Projection (See Template 3.120)',
            //121-139: 'Reserved'
            140: 'Lambert Azimuthal Equal Area Projection (See Template 3.140)',
            //141-203: 'Reserved'
            204: 'Curvilinear Orthogonal Grids (See Template 3.204)',
            //205-999: 'Reserved'
            1000: 'Cross Section Grid with Points Equally Spaced on the Horizontal (See Template 3.1000)',
            //1001-1099: 'Reserved'
            1100: 'Hovmoller Diagram with Points Equally Spaced on the Horizontal (See Template 3.1100)',
            //1101-1199: 'Reserved'
            1200: 'Time Section Grid (See Template 3.1200)',
            //1201-32767: 'Reserved'
            32768: 'Rotated Latitude/Longitude (Arakawa Staggered E-Grid) (See Template 3.32768)',
            //32768-65534: 'Reserved for Local Use\n'
            32769: 'Rotated Latitude/Longitude (Arakawa Non-E Staggered Grid) (See Template 3.32769)',
            65535: 'Missing'
        },
        // Shape of the Reference System
        '3.2': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-2.shtml
            0: 'Earth assumed spherical with radius = 6,367,470.0 m',
            1: 'Earth assumed spherical with radius specified (in m) by data producer',
            2: 'Earth assumed oblate spheriod with size as determined by IAU in 1965 (major axis = 6,378,160.0 m, minor axis = 6,356,775.0 m, f = 1/297.0)',
            3: 'Earth assumed oblate spheriod with major and minor axes specified (in km) by data producer',
            4: 'Earth assumed oblate spheriod as defined in IAG-GRS80 model (major axis = 6,378,137.0 m, minor axis = 6,356,752.314 m, f = 1/298.257222101)',
            5: 'Earth assumed represented by WGS84 (as used by ICAO since 1998) (Uses IAG-GRS80 as a basis)',
            6: 'Earth assumed spherical with radius = 6,371,229.0 m',
            7: 'Earth assumed oblate spheroid with major and minor axes specified (in m) by data producer',
            8: 'Earth model assumed spherical with radius 6,371,200 m, but the horizontal datum of the resulting Latitude/Longitude field is the WGS84 reference frame',
            9: 'Earth represented by the OSGB 1936 Datum, using the Airy_1830 Spheroid, the Greenwich meridian as 0 Longitude, the Newlyn datum as mean sea level, 0 height.',
            //10-191: 'Reserved'
            //192-254: 'Reserved for Local Use\n'
            255: 'Missing'

        },
        // Resolution and Component Flags
        '3.3': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-3.shtml
            1: ['Reserved', 'Reserved'],
            2: ['Reserved', 'Reserved'],
            3: ['0: i direction increments not given', '1: i direction increments given'],
            4: ['0: j direction increments not given', '1: j direction increments given'],
            5: ['0: Resolved u and v components of vector quantities relative to easterly and northerly directions', '1: Resolved u and v components of vector quantities relative to the defined grid in the direction of increasing x and y(or i and j) coordinates, respectively.'],
            6: ['Reserved - set to zero'],
            7: ['Reserved - set to zero'],
            8: ['Reserved - set to zero']
            // It is an int8, with bit information
            // 0000 0000
            //0: 'i and j direction increments not given. Resolved u and v components of vector quantities relative to easterly and northerly directions.',
            // 0000 0100
            //4: 'i direction increments given. j direction increments not given. Resolved u and v components of vector quantities relative to easterly and northerly directions.',
            // 0000 1000
            //8: 'i direction increments not given. j direction increments given. Resolved u and v components of vector quantities relative to easterly and northerly directions.',
            // 0000 1100
            //12: 'i and j direction increments given. Resolved u and v components of vector quantities relative to easterly and northerly directions.',
            // 0001 0000
            //16: 'i and j direction increments not given. Resolved u and v components of vector quantities relative to the defined grid in the direction of increasing x and y (or i and j) coordinates, respectively.',
            // 0001 0100
            //20: 'i direction increments given. j direction increments not given. Resolved u and v components of vector quantities relative to the defined grid in the direction of increasing x and y (or i and j) coordinates, respectively.',
            // 0001 1000
            //24: 'i direction increments not given. j direction increments given. Resolved u and v components of vector quantities relative to the defined grid in the direction of increasing x and y (or i and j) coordinates, respectively.',
            // 0001 1100
            //24: 'i and j direction increments given. Resolved u and v components of vector quantities relative to the defined grid in the direction of increasing x and y (or i and j) coordinates, respectively.'
            //1-2: Reserved
            //3: ['0: i direction increments not given','1: i direction increments given'],
            //4: ['0: j direction increments not given','1: j direction increments given'],
            //5: ['0: Resolved u and v components of vector quantities relative to easterly and northerly directions','1: Resolved u and v components of vector quantities relative to the defined grid in the direction of increasing x and y (or i and j) coordinates, respectively.'],
            //6-8: Reserved - set of zero
        },
        // Scanning Mode
        '3.4': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-4.shtml
            1: ['0: Points in the first row or column scan in the +i (+x) direction','1: Points in the first row or column scan in the -i (-x) direction'],
            2: ['0: Points in the first row or column scan in the -j (-y) direction','1: Points in the first row or column scan in the +j (+y) direction'],
            3: ['0: Adjacent points in the i (x) direction are consecutive','1: Adjacent points in the j (y) direction are consecutive'],
            4: ['0: All rows scan in the same direction','1: Adjacent rows scan in the opposite direction'],
            5: ['0: Points within odd rows are not offset in i(x) direction','1: Points within odd rows are offset by Di/2 in i(x) direction'],
            6: ['0: Points within even rows are not offset in i(x) direction', '1: Points within even rows are offset by Di/2 in i(x) direction'],
            7: ['0: Points are not offset in j(y) direction', '1: Points are offset by Dj/2 in j(y) direction'],
            8: ['0: Rows have Ni grid points and columns have Nj grid points', '1: Rows have Ni grid points if points are not offset in i direction. Rows have Ni-1 grid points if points are offset by Di/2 in i direction. Columns have Nj grid points if points are not offset in j direction. Columns have Nj-1 grid points if points are offset by Dj/2 in j direction']
            // Notes:
            //1.  i direction - West to east along a parallel or left to right along an x-axis.
            //2.  j direction - South to north along a meridian, or bottom to top along a y-axis.
            //3.  If bit number 4 is set, the first row scan is defined by previous flags.
            //4.  La1 and Lo1 define the first row, which is an odd row.
            //5.  Di and Dj are assumed to be positive, with the direction of i and j being given by bits 1 and 2.
            //6.  Bits 5 through 8 may be used to generate staggered grids, such as Arakawa grids (see Attachment, Volume 1.2, Part A, Att. GRIB).
            //7.  If any of bits 5, 6, 7 or 8 are set, Di and Dj are not optional.
        },
        // Projection Center
        '3.5': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-5.shtml
            1: ['0: North Pole is on the projection plane', '1: South Pole is on the projection plane'],
            2: ['0: Only one projection center is used', '1: Projection is bi-polar and symmetric']
            //3-8: Reserved
        },
        // Spectral Data Representation Type
        '3.6': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-6.shtml
            1: 'Legendre Functions',
            2: 'Bi-Fourier representation'
        },
        // Spectral Data Representation Mode
        '3.7': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-7.shtml
            1: 'Mathematical formula. Check online: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-7.shtml'
        },
        // Grid Point Position
        '3.8': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-8.shtml
            0: 'Grid points at triangle vertices',
            1: 'Grid points at centers of triangles',
            2: 'Grid points at midpoints of triangle sides',
            //3-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Numbering Order of Diamonds
        '3.9': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-9.shtml
            1: ['0: Clockwise orientation', '1: Counter-clockwise orientation']
        },
        // Scanning Mode for One Diamond
        '3.10': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-10.shtml
            1: ['0: Points  scan in the +i direction, i.e. from pole to Equator','1: Points scan in the -i direction, i.e. from Equator to pole'],
            2: ['0: Points scan in the +j direction, i.e. from west to east','1: Points scan in the -j direction, i.e. from east to west'],
            3: ['0: Adjacent points in the i (x) direction are consecutive','1: Adjacent points in the j (y) direction are consecutive']
        },
        // Interpretation of List of Numbers at end of section 3
        '3.11': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-11.shtml
            0: 'There is no appended list',
            1: 'Numbers define number of points corresponding to full coordinate circles (i.e. parallels).  Coordinate values on each circle are multiple of the circle mesh, and extreme coordinate values given in grid definition may not be reached in all rows.',
            2: 'Numbers define number of points corresponding to coordinate lines delimited by extreme coordinate values given in grid definition which are present in each row.',
            3: 'Numbers define the actual latitudes for each row in the grid. The list of numbers are integer values of the valid latitudes in microdegrees (scale by 106) or in unit equal to the ratio of the basic angle and the subdivisions number for each row, in the same order as specified in the \'scanning mode flag\' (bit no. 2) (see note 2)',
            //4-254: 'Reserved',
            255: 'Missing',
            //Notes:
            //(1) For entry 1, it should be noted that depending on values of extreme (first/last) coordinates, and regardless of bit-map, effective number of points per row may be less than the number of points on the current circle.
            //(2) For value for the constant direction increment Di (or Dx) in the accompanying Grid Definition Template should be set to all ones (missing).
        },
        // Physical Meaning of Vertical Coordinate
        '3.15': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-15.shtml
            //0-19: 'Reserved',
            20: 'Temperature',
            //21-99: 'Reserved',
            100: 'Pressure',
            101: 'Pressure deviation from mean sea level',
            102: 'Altitude above mean sea level',
            103: 'Height above ground (see note 1)',
            104: 'Sigma coordinate',
            105: 'Hybrid coordinate',
            106: 'Depth below land surface',
            107: 'Potential temperature (theta)',
            108: 'Pressure deviation from ground to level',
            109: 'Potential vorticity',
            110: 'Geometric height',
            111: 'Eta coordinate (see note 2)',
            112: 'Geopotential height',
            113: 'Logarithmic hybrid coordinate',
            //114-159: 'Reserved',
            160: 'Depth below sea level',
            //161-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Type of Horizontal Line
        '3.20': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-20.shtml
            0: 'Rhumb',
            1: 'Great Circle',
            //2-191: Reserved
            //192-254: Reserved For Local Use
            255: 'Missing'
        },
        // Vertical Dimension Coordinate Values Definition
        '3.21': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-21.shtml
            0: 'Explicit coordinate value set',
            1: 'Linear Cooordinates\nf(1) = C1\nf(n) = f(n-1) + C2\n',
            //2-10: Reserved
            11: 'Geometric Coordinates\nf(1) = C1\nf(n) = C2 x f(n-1)\n',
            //12-191: Reserved
            // 192-254: Reserved for Local Use
            255: 'Missing'
        },
        // TODO
        // Product Definition Template Number
        '4.0': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-0.shtml
            0: 'Analysis or forecast at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.0)',
            1: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.1)',
            2: 'Derived forecasts based on all ensemble members at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.2)',
            3: 'Derived forecasts based on a cluster of ensemble members over a rectangular area at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.3)',
            4: 'Derived forecasts based on a cluster of ensemble members over a circular area at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.4)',
            5: 'Probability forecasts at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.5)',
            6: 'Percentile forecasts at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.6)',
            7: 'Analysis or forecast error at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.7)',
            8: 'Average, accumulation, extreme values or other statistically processed values at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval.  (see Template 4.8)',
            9: 'Probability forecasts at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval.  (see Template 4.9)',
            10: 'Percentile forecasts at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval.  (see Template 4.10)',
            11: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval.  (see Template 4.11)',
            12: 'Derived forecasts based on all ensemble members at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval.  (see Template 4.12)',
            13: 'Derived forecasts based on a cluster of ensemble members over a rectangular area at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval.  (see Template 4.13)',
            14: 'Derived forecasts based on a cluster of ensemble members over a circular area at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval.  (see Template 4.14)',
            15: 'Average, accumulation, extreme values or other statistically-processed values over a spatial area at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.15)',
            //16-19: 'Reserved',
            20: 'Radar product  (see Template 4.20)',
            //21-29: 'Reserved',
            30: 'Satellite product  (see Template 4.30)NOTE: This template is deprecated. Template 4.31 should be used instead.',
            31: 'Satellite product  (see Template 4.31)',
            32: 'Analysis or forecast at a horizontal level or in a horizontal layer at a point in time for simulate (synthetic) satellite data (see Template 4.32)',
            33: 'Individual Ensemble Forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time for simulated (synthetic) satellite data (see Template 4.33)',
            34: 'Individual Ensemble Forecast, control and perturbed, at a horizontal level or in a horizontal layer, in a continuous or non-continuous interval for simulated (synthetic) satellite data(see Template 4.34)',
            35: 'Satellite product with or without associated quality values (see Template 4.35)',
            //36-39: 'Reserved',
            40: 'Analysis or forecast at a horizontal level or in a horizontal layer at a point in time for atmospheric chemical constituents.  (see Template 4.40)',
            41: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time for atmospheric chemical constituents.  (see Template 4.41)',
            42: 'Average, accumulation, and/or extreme values or other statistically processed values at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval for atmospheric chemical constituents.  (see Template 4.42)',
            43: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval for atmospheric chemical constituents.  (see Template 4.43)',
            44: 'Analysis or forecast at a horizontal level or in a horizontal layer at a point in time for aerosol.  (see Template 4.44)',
            45: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval for aerosol.  (see Template 4.45)',
            46: 'Average, accumulation, and/or extreme values or other statistically processed values at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval for aerosol.  (see Template 4.46)',
            47: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval for aerosol.  (see Template 4.47)',
            48: 'Analysis or forecast at a horizontal level or in a horizontal layer at a point in time for aerosol.  (see Template 4.48)',
            49: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time for optical properties of aerosol. (see Template 4.49)',
            50: 'Reserved',
            51: 'Categorical forecast at a horizontal level or in a horizontal layer at a point in time.  (see Template 4.51)',
            52: 'Reserved',
            53: 'Partitioned parameters at a horizontal level or horizontal layer at a point in time.  (see Template 4.53)',
            54: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time for partitioned parameters.   (see Template 4.54)',
            55: 'Spatio-temporal changing tiles at a horizontal level or horizontal layer at a point in time (see Template 4.55)',
            56: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time for spatio-temporal changing tile parameters.   (see Template 4.56)',
            57: 'Analysis or forecast at a horizontal level or in a horizontal layer at a point in time for atmospheric chemical constituents based on a distribution function (see Template 4.57)',
            58: 'Individual Ensemble Forecast, Control and Perturbed, at a horizontal level or in a horizontal layer at a point in time interval for Atmospheric Chemical Constituents based on a distribution function (see Template 4.58)',
            59: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time for spatio-temporal changing tile parameters (corrected version of template 4.56 - See Template 4.59)',
            60: 'Individual Ensemble Reforecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time. (see Template 4.60)',
            61: 'Individual Ensemble Reforecast, control and perturbed, at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval (see Template 4.61)',
            62: 'Average, Accumulation and/or Extreme values or other Statistically-processed values at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval for spatio-temporal changing tiles at a horizontal level or horizontal layer at a point in time (see Template 4.62)',
            63: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval for spatio-temporal changing tiles (see Template 4.63)',
            //64-66: 'Reserved',
            67: 'Average, accumulation and/or extreme values or other statistically processed values at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval for atmospheric chemical constituents based on a distribution function (see Template 4.67)',
            68: 'Individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval for atmospheric chemical constituents based on a distribution function. (see Template 4.68)',
            69: 'Reserved',
            70: 'Post-processing analysis or forecast at a horizontal level or in a horizontal layer at a point in time. (see Template 4.70)',
            71: 'Post-processing individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer at a point in time. (see Template 4.71)',
            72: 'Post-processing average, accumulation, extreme values or other statistically processed values at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval. (see Template 4.72)',
            73: 'Post-processing individual ensemble forecast, control and perturbed, at a horizontal level or in a horizontal layer, in a continuous or non-continuous time interval. (see Template 4.73)',
            //74-90: 'Reserved',
            91: 'Categorical forecast at a horizontal level or in a horizontal layer in a continuous or non-continuous time interval.  (see Template 4.91)',
            //92-253: 'Reserved',
            254: 'CCITT IA5 character string  (see Template 4.254)',
            //255-999: 'Reserved',
            1000: 'Cross-section of analysis and forecast at a point in time.  (see Template 4.1000)',
            1001: 'Cross-section of averaged or otherwise statistically processed analysis or forecast over a range of time.  (see Template 4.1001)',
            1002: 'Cross-section of analysis and forecast, averaged or otherwise statistically-processed over latitude or longitude.  (see Template 4.1002)',
            //1003-1099: 'Reserved',
            1100: 'Hovmoller-type grid with no averaging or other statistical processing  (see Template 4.1100)',
            1101: 'Hovmoller-type grid with averaging or other statistical processing  (see Template 4.1101)',
            //1102-32767: 'Reserved',
            //32768-65534: 'Reserved for Local Use',
            65535: 'Missing',
        },
        // TODO
        // Parameter Category by Product Discipline
        '4.1': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml
            0: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            1: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            2: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            3: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            4: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            5: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            6: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            7: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            8: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            9: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            10: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            11: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            12: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            13: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            14: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            15: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            16: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            17: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            18: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            19: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            20: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-1.shtml',
            255: 'Missing'
            // Note: The disciplines are given in Section 0, Octet 7 of the GRIB2 message and are defined in Table 0.0.
        },
        // TODO
        // Parameter Number by Product Discipline and Parameter Category
        '4.2': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml
            0: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            1: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            2: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            3: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            4: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            5: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            6: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            7: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            8: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            9: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            10: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            11: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            12: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            13: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            14: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            15: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            16: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            17: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            18: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            19: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            20: 'Depends of category (Octet 7 of Section 0). Check in: https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-2.shtml',
            255: 'Missing'
        },
        // Type of Generating Process
        '4.3': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-3.shtml
            0: 'Analysis',
            1: 'Initialization', 
            2: 'Forecast', 
            3: 'Bias Corrected Forecast', 
            4: 'Ensemble Forecast', 
            5: 'Probability Forecast', 
            6: 'Forecast Error', 
            7: 'Analysis Error', 
            8: 'Observation',
            9: 'Climatological',
            10: 'Probability-Weighted Forecast',
            11: 'Bias-Corrected Ensemble Forecast',
            12: 'Post-processed Analysis (See Note)',
            13: 'Post-processed Forecast (See Note)',
            14: 'Nowcast',
            15: 'Hindcast',
            16: 'Physical Retrieval',
            17: 'Regression Analysis',
            18: 'Difference Between Two Forecasts',
            //19-191: 'Reserved',
            192: 'Forecast Confidence Indicator',
            //192-254: 'Reserved for Local Use',
            193: 'Probability-matched Mean',
            194: 'Neighborhood Probability',
            195: 'Bias-Corrected and Downscaled Ensemble Forecast',
            196: 'Perturbed Analysis for Ensemble Initialization',
            197: 'Ensemble Agreement Scale Probability',
            198: 'Post-Processed Deterministic-Expert-Weighted Forecast',
            199: 'Ensemble Forecast Based on Counting',
            200: 'Local Probability-matched Mean',
            255: 'Missing',
            // Notes:
            // 1.  Code figures 12 and 13 are intended in cases where code figures 0 and 2 may not be sufficient to indicate that significant post-processing has taken place on an intial analysis or forecast output.
        },
        // Indicator of Unit of Time Range
        '4.4': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-4.shtml
            0: 'Minute',
            1: 'Hour',
            2: 'Day',
            3: 'Month',
            4: 'Year',
            5: 'Decade (10 Years)',
            6: 'Normal (30 Years)',
            7: 'Century (100 Years)',
            8: 'Reserved',
            9: 'Reserved',
            10: '3 Hours',
            11: '6 Hours',
            12: '12 Hours',
            13: 'Second',
            //14-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Fixed Surface Types and Units
        '4.5': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-5.shtml
            0: 'Reserved',
            1: 'Ground or Water Surface',
            2: 'Cloud Base Level',
            3: 'Level of Cloud Tops',
            4: 'Level of 0o C Isotherm',
            5: 'Level of Adiabatic Condensation Lifted from the Surface',
            6: 'Maximum Wind Level',
            7: 'Tropopause',
            8: 'Nominal Top of the Atmosphere',
            9: 'Sea Bottom',
            10: 'Entire Atmosphere',
            11: 'Cumulonimbus Base (CB)',
            12: 'Cumulonimbus Top (CT)',
            13: 'Lowest level where vertically integrated cloud cover exceeds the specified percentage(cloud base for a given percentage cloud cover)',
            14: 'Level of free convection (LFC)',
            15: 'Convection condensation level (CCL)',
            16: 'Level of neutral buoyancy or equilibrium (LNB)',
            //17-19: 'Reserved',
            20: 'Isothermal Level',
            21: 'Lowest level where mass density exceeds the specified value(base for a given threshold of mass density)',
            22: 'Highest level where mass density exceeds the specifiedvalue (top for a given threshold of mass density)',
            23: 'Lowest level where air concentration exceeds the specifiedvalue (base for a given threshold of air concentration',
            24: 'Highest level where air concentration exceeds the specifiedvalue (top for a given threshold of air concentration)',
            25: 'Highest level where radar reflectivity exceeds the specifiedvalue (echo top for a given threshold of reflectivity)',
            //26-99: 'Reserved',
            100: 'Isobaric Surface',
            101: 'Mean Sea Level',
            102: 'Specific Altitude Above Mean Sea Level',
            103: 'Specified Height Level Above Ground',
            104: 'Sigma Level',
            105: 'Hybrid Level',
            106: 'Depth Below Land Surface',
            107: 'Isentropic (theta) Level',
            108: 'Level at Specified Pressure Difference from Ground to Level',
            109: 'Potential Vorticity Surface',
            110: 'Reserved',
            111: 'Eta Level',
            112: 'Reserved',
            113: 'Logarithmic Hybrid Level',
            114: 'Snow Level',
            115: 'Sigma height level (see Note 4)',
            116: 'Reserved',
            117: 'Mixed Layer Depth',
            118: 'Hybrid Height Level',
            119: 'Hybrid Pressure Level',
            //120-149: 'Reserved',
            150: 'Generalized Vertical Height Coordinate (see Note 4)',
            151: 'Soil level (See Note 5)',
            //152-159: 'Reserved',
            160: 'Depth Below Sea Level',
            161: 'Depth Below Water Surface',
            162: 'Lake or River Bottom',
            163: 'Bottom Of Sediment Layer',
            164: 'Bottom Of Thermally Active Sediment Layer',
            165: 'Bottom Of Sediment Layer Penetrated By Thermal Wave',
            166: 'Mixing Layer',
            167: 'Bottom of Root Zone',
            168: 'Ocean Model Level',
            169: 'Ocean level defined by water density (sigma-theta)difference from near-surface to level (see Note 7)',
            170: 'Ocean level defined by water potential temperaturedifference from near-surface to level (see Note 7)',
            //171-173: 'Reserved',
            174: 'Top Surface of Ice on Sea, Lake or River',
            175: 'Top Surface of Ice, under Snow, on Sea, Lake or River',
            176: 'Bottom Surface (underside) Ice on Sea, Lake or River',
            177: 'Deep Soil (of indefinite depth)',
            178: 'Reserved',
            179: 'Top Surface of Glacier Ice and Inland Ice',
            180: 'Deep Inland or Glacier Ice (of indefinite depth)',
            181: 'Grid Tile Land Fraction as a Model Surface',
            182: 'Grid Tile Water Fraction as a Model Surface',
            183: 'Grid Tile Ice Fraction on Sea, Lake or River as a Model Surface',
            184: 'Grid Tile Glacier Ice and Inland Ice Fraction as a Model Surface',
            //185-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            200: 'Entire atmosphere (considered as a single layer)',
            201: 'Entire ocean (considered as a single layer)',
            204: 'Highest tropospheric freezing level',
            206: 'Grid scale cloud bottom level',
            207: 'Grid scale cloud top level',
            209: 'Boundary layer cloud bottom level',
            210: 'Boundary layer cloud top level',
            211: 'Boundary layer cloud layer',
            212: 'Low cloud bottom level',
            213: 'Low cloud top level',
            214: 'Low cloud layer',
            215: 'Cloud ceiling',
            216: 'Effective Layer Top Level',
            217: 'Effective Layer Bottom Level',
            218: 'Effective Layer',
            220: 'Planetary Boundary Layer',
            221: 'Layer Between Two Hybrid Levels',
            222: 'Middle cloud bottom level',
            223: 'Middle cloud top level',
            224: 'Middle cloud layer',
            232: 'High cloud bottom level',
            233: 'High cloud top level',
            234: 'High cloud layer',
            235: 'Ocean Isotherm Level (1/10 ° C)',
            236: 'Layer between two depths below ocean surface',
            237: 'Bottom of Ocean Mixed Layer (m)',
            238: 'Bottom of Ocean Isothermal Layer (m)',
            239: 'Layer Ocean Surface and 26C Ocean Isothermal Level',
            240: 'Ocean Mixed Layer',
            241: 'Ordered Sequence of Data',
            242: 'Convective cloud bottom level',
            243: 'Convective cloud top level',
            244: 'Convective cloud layer',
            245: 'Lowest level of the wet bulb zero',
            246: 'Maximum equivalent potential temperature level',
            247: 'Equilibrium level',
            248: 'Shallow convective cloud bottom level',
            249: 'Shallow convective cloud top level',
            251: 'Deep convective cloud bottom level',
            252: 'Deep convective cloud top level',
            253: 'Lowest bottom level of supercooled liquid water layer',
            254: 'Highest top level of supercooled liquid water layer',
            255: 'Missing',
            // Notes: 
            // (1).  The Eta vertical coordinate system involves normalizing the pressure at some point on a specific level by the mean sea level pressure at that point. 
            // (2).  Hybrid height level (Code figure 118) can be defined as: z(k)=A(k)+B(k)* orog (k=1,..., NLevels; orog=orography; z(k)=height in meters at level(k) 
            // (3).  Hybrid pressure level, for which code figure 119 shall be used insteaf of 105, can be defined as: p(k)=A(k) + B(k) * sp (k=1,...,NLevels, sp=surface pressure; p(k)=pressure at level (k) 
            // (4). Sigma height level is the vertical model level of the height-based terrain-following coordinate (Gal-Chen and Somerville, 1975). The value of the level = (height of the level – height of the terrain) / (height of the top level – height of the terrain), which is ≥ 0 and ≤ 1. 
            // (5).  The definition of a generalized vertical height coordinate implies the absence of coordinate values in section 4 but the presence of an external 3D-GRIB message that specifies the height of every model grid point in meters (see Notes for section 4), i.e., this GRIB message will contain the field with discipline = 0, category = 3, parameterm = 6 (Geometric height). 
            // (6).  The soil level represents a model level for which the depth is not constant across the model domain. The depth in metres of the level is provided by another GRIB message with the parameter 'Soil Depth' with discipline 2, category 3 and parameter number 27. 
            // (7).  The level is defined by a water property difference from the near-surface to the level. The near-surface is typically chosen at 10 m depth. The physical quantity used to compute the difference can be water density (δΘ) when using level type 169 or water potential temperature (Θ) when using level type 170.
        },
        // Type of Ensemble Forecast
        '4.6': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-6.shtml
            0: 'Unperturbed High-Resolution Control Forecast',
            1: 'Unperturbed Low-Resolution Control Forecast',
            2: 'Negatively Perturbed Forecast',
            3: 'Positively Perturbed Forecast',
            4: 'Multi-Model Forecast',
            //5-191: 'Reserved',
            192: 'Perturbed Ensemble Member',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Derived Forecast
        '4.7': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-7.shtml
            0: 'Unweighted Mean of All Members',
            1: 'Weighted Mean of All Members',
            2: 'Standard Deviation with respect to Cluster Mean',
            3: 'Standard Deviation with respect to Cluster Mean, Normalized',
            4: 'Spread of All Members',
            5: 'Large Anomaly Index of All Members (see Note 1)',
            6: 'Unweighted Mean of the Cluster Members',
            7: 'Interquartile Range (Range between the 25th and 75th quantile)',
            //7-191: 'Reserved',
            8: 'Minimum Of All Ensemble Members (see Note 2)',
            9: 'Maximum Of All Ensemble Members (see Note 2)',
            192: 'Unweighted Mode of All Members',
            //192-254: 'Reserved for Local Use',
            193: 'Percentile value (10%) of All Members',
            194: 'Percentile value (50%) of All Members',
            195: 'Percentile value (90%) of All Members',
            196: 'Statistically decided weights for each ensemble member',
            197: 'Climate Percentile (percentile values from climate distribution)',
            198: 'Deviation of Ensemble Mean from Daily Climatology',
            199: 'Extreme Forecast Index',
            200: 'Equally Weighted Mean',
            201: 'Percentile value (5%) of All Members',
            202: 'Percentile value (25%) of All Members',
            203: 'Percentile value (75%) of All Members',
            204: 'Percentile value (95%) of All Members',
            255: 'Missing',
            // Notes: 
            // 1.  Large anomaly index is defined as {(number of members whose anomaly is higher than 0.5*SD) - (number of members whose anomaly is lower than -0.5*SD)}/(number of members) at each grid point.  SD is the observed climatological standard deviation. 
            // 2.  It should be noted that the reference for 'minimum of all ensemble members' and 'maximum of all ensemble members' is the set of ensemble members and not a time interval and should not be confused with the maximum and minimum described by Product Definition Template 4.8.
        },
        // Clustering Method
        '4.8': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-8.shtml
            0: 'Anomoly Correlation',
            1: 'Root Mean Square',
            //2-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing'
        },
        // Probability Type
        '4.9': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-9.shtml
            0: 'Probability of event below lower limit',
            1: 'Probability of event above upper limit',
            2: 'Probability of event between upper and lower limits (the range includes lower limit but no the upper limit)',
            3: 'Probability of event above lower limit',
            4: 'Probability of event below upper limit',
            5: 'Probability of event equal to lower limit',
            6: 'Probability of event in above normal category (see Notes 1 and 2)',
            7: 'Probability of event in near normal category (see Notes 1 and 2)',
            8: 'Probability of event in below normal category (see Notes 1 and 2)',
            //9-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing'
        },
        // Type of Statistical Processing
        '4.10': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-10.shtml
            0: 'Average',
            1: 'Accumulation (see Note 1)',
            2: 'Maximum',
            3: 'Minimum',
            4: 'Difference (value at the end of the time range minus value at the beginning)',
            5: 'Root Mean Square',
            6: 'Standard Deviation',
            7: 'Covariance (temporal variance) (see Note 2)',
            8: 'Difference ( value at the beginning of the time range minus value at the end)',
            9: 'Ratio (see Note 3)',
            10: 'Standardized Anomaly',
            11: 'Summation',
            12: 'Confidence Index (see Note 4)     Validation',
            13: 'Quality Indicator (see Note 5)       Validation',
            //14-191: 'Reserved',
            192: 'Climatological Mean Value: multiple year averages of quantities which are themselves means over some period of time (P2) less than a year. The reference time (R) indicates the date and time of the start of a period of time, given by R to R + P2, over which a mean is formed; N indicates the number of such period-means that are averaged together to form the climatological value, assuming that the N period-mean fields are separated by one year. The reference time indicates the start of the N-year climatology. N is given in octets 22-23 of the PDS.\nIf P1 = 0 then the data averaged in the basic interval P2 are assumed to be continuous, i.e., all available data are simply averaged together.\n\nIf P1 = 1 (the units of time - octet 18, code table 4 - are not relevant here) then the data averaged together in the basic interval P2 are valid only at the time (hour, minute) given in the reference time, for all the days included in the P2 period. The units of P2 are given by the contents of octet 18 and Table 4.',
            //192-254: 'Reserved for Local Use',
            193: 'Average of N forecasts (or initialized analyses); each product has forecast period of P1 (P1=0 for initialized analyses); products have reference times at intervals of P2, beginning at the given reference time.',
            194: 'Average of N uninitialized analyses, starting at reference time, at intervals of P2.',
            195: 'Average of forecast accumulations. P1 = start of accumulation period. P2 = end of accumulation period. Reference time is the start time of the first forecast, other forecasts at 24-hour intervals. Number in Ave = number of forecasts used.',
            196: 'Average of successive forecast accumulations. P1 = start of accumulation period. P2 = end of accumulation period. Reference time is the start time of the first forecast, other forecasts at (P2 - P1) intervals. Number in Ave = number of forecasts used',
            197: 'Average of forecast averages. P1 = start of averaging period. P2 = end of averaging period. Reference time is the start time of the first forecast, other forecasts at 24-hour intervals. Number in Ave = number of forecast used',
            198: 'Average of successive forecast averages. P1 = start of averaging period. P2 = end of averaging period. Reference time is the start time of the first forecast, other forecasts at (P2 - P1) intervals. Number in Ave = number of forecasts used',
            199: 'Climatological Average of N analyses, each a year apart, starting from initial time R and for the period from R+P1 to R+P2.',
            200: 'Climatological Average of N forecasts, each a year apart, starting from initial time R and for the period from R+P1 to R+P2.',
            201: 'Climatological Root Mean Square difference between N forecasts and their verifying analyses, each a year apart, starting with initial time R and for the period from R+P1 to R+P2.',
            202: 'Climatological Standard Deviation of N forecasts from the mean of the same N forecasts, for forecasts one year apart. The first forecast starts wtih initial time R and is for the period from R+P1 to R+P2.',
            203: 'Climatological Standard Deviation of N analyses from the mean of the same N analyses, for analyses one year apart. The first analyses is valid for  period R+P1 to R+P2.',
            204: 'Average of forecast accumulations. P1 = start of accumulation period. P2 = end of accumulation period. Reference time is the start time of the first forecast, other forecasts at 6-hour intervals. Number in Ave = number of forecast used',
            205: 'Average of forecast averages. P1 = start of averaging period. P2 = end of averaging period. Reference time is the start time of the first forecast, other forecasts at 6-hour intervals. Number in Ave = number of forecast used',
            206: 'Average of forecast accumulations. P1 = start of accumulation period. P2 = end of accumulation period. Reference time is the start time of the first forecast, other forecasts at 12-hour intervals. Number in Ave = number of forecast used',
            207: 'Average of forecast averages. P1 = start of averaging period. P2 = end of averaging period. Reference time is the start time of the first forecast, other forecasts at 12-hour intervals. Number in Ave = number of forecast used',
            208: 'Variance',
            209: 'Confficient',
            255: 'Missing'
        },
        '4.11' : {
            0: 'Reserved',
            1: 'Successive times processed have same forecast time, start time of forecast is incremented.',
            2: 'Successive times processed have same start time of forecast, forecast time is incremented.',
            3: 'Successive times processed have start time of forecast incremented and forecast time decremented so that valid time remains constant.',
            4: 'Successive times processed have start time of forecast decremented and forecast time incremented so that valid time remains constant.',
            5: 'Floating subinterval of time between forecast time and end of overall time interval.(see Note 1)',
            //6-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing'
        },
        // TODO 4.11 to 4.244

        // Data Representation Template Number
        '5.0' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-0.shtml
            0: 'Grid Point Data - Simple Packing (see Template 5.0)',
            1: 'Matrix Value at Grid Point - Simple Packing (see Template 5.1)',
            2: 'Grid Point Data - Complex Packing (see Template 5.2)',
            3: 'Grid Point Data - Complex Packing and Spatial Differencing (see Template 5.3)',
            4: 'Grid Point Data - IEEE Floating Point Data (see Template 5.4)',
            //5-39: 'Reserved',
            40: 'Grid Point Data - JPEG2000 Compression (see Template 5.40)',
            41: 'Grid Point Data - PNG Compression (see Template 5.41)',
            //42-49: 'Reserved',
            50: 'Spectral Data - Simple Packing (see Template 5.50)',
            51: 'Spectral Data - Complex Packing (see Template 5.51)',
            //52-60: 'Reserved',
            61: 'Grid Point Data - Simple Packing With Logarithm Pre-processing (see Template 5.61)',
            //62-199: 'Reserved',
            200: 'Run Length Packing With Level Values (see Template 5.200)',
            //201-49151: '201-49151',
            //49152-65534: 'Reserved for Local Use',
            65535: 'Missing',
        },
        // Type of Original Field Values
        '5.1' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-1.shtml
            0: 'Floating Point',
            1: 'Integer',
            //2-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Matrix Coordinate Value Function Definition
        '5.2' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-2.shtml
            0: 'Explicit Coordinate Values Set',
            1: 'Linear Coordinates\nf(1) = C1\nf(n) = f(n-1) + C2\n',
            //2-10: 'Reserved',
            11: 'Geometric Coordinates\nf(1) = C1\nf(n) = C2 x f(n-1)\n',
            //12-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Matrix Coordinate Parameter
        '5.3' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-3.shtml
            0: 'Reserved',
            1: 'Direction Degrees True',
            2: 'Frequency (s^-1)',
            3: 'Radial Number (2pi/lamda) (m^-1)',
            //4-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Group Splitting Method
        '5.4' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-4.shtml
            0: 'Row by Row Splitting',
            1: 'General Group Splitting',
            //2-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Missing Value Management for Complex Packing
        '5.5' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-5.shtml
            0: 'No explicit missing values included within the data values',
            1: 'Primary missing values included within the data values',
            2: 'Primary and secondary missing values included within the data values',
            //3-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Order of Spatial Differencing
        '5.6' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-6.shtml
            0: 'Reserved',
            1: 'First-Order Spatial Differencing',
            2: 'Second-Order Spatial Differencing',
            //3-191: 'Reserved',
            //192-254: 'Reserved for Local Use',
            255: 'Missing',
        },
        // Precision of Floating Point Numbers
        '5.7' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-7.shtml
            0: 'Reserved',
            1: 'IEEE 32-bit (I=4 in Section 7)',
            2: 'IEEE 64-bit (I=8 in Section 7)',
            3: 'IEEE 128-bit (I=16 in Section 7)',
            //4-254: 'Reserved',
            255: 'Missing',
        },
        // Type of Compression
        '5.40' : { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-40.shtml
            0: 'Lossless',
            1: 'Lossy',
            //2-254: 'Reserved',
            255: 'Missing',
        },
        // Bit Map Indicator
        '6.0': { // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table6-0.shtml
            0: 'A bit map applies to this product and is specified in this section.',
            //1-253: 'A bit map pre-determined by the orginating/generating center applies to this product and is not specified in this section.',
            254: 'A bit map previously defined in the same GRIB2 message applies to this product.',
            255: 'A bit map does not apply to this product.',
        },
        // 
        '7.0': { //
            0: 'Grid Point Data - Simple Packing (see Template 7.0)',
            1: 'Matrix Value at Grid Point - Simple Packing (see Template 7.1)',
            2: 'Grid Point Data - Complex Packing (see Template 7.2)',
            3: 'Grid Point Data - Complex Packing and Spatial Differencing (see Template 7.3)',
            4: 'Grid Point Data - IEEE Floating Point Data (see Template 7.4)',
            //5-39: 'Reserved',
            40: 'Grid Point Data - JPEG2000 Compression (see Template 7.40)',
            41: 'Grid Point Data - Portable Network Graphics (PNG) format (see Template 7.41)',
            //42-49: 'Reserved',
            50: 'Spectral Data - Simple Packing (see Template 7.50)',
            51: 'Spectral Data - Complex Packing (see Template 7.51)',
            //52-49151: 'Reserved',
            //49152-65534: 'Reserved for Local Use',
            65535: 'Missing',
        },
        // Generating Process or Model from Originating Center 7 (US-NWS, NCEP)
        'ON388 Table A': { // https://www.nco.ncep.noaa.gov/pmb/docs/on388/tablea.html
            //00-01: 'Reserved',
            02: 'Ultra Violet Index Model',
            03: 'NCEP/ARL Transport and Dispersion Model',
            04: 'NCEP/ARL Smoke Model',
            05: 'Satellite Derived Precipitation and temperatures, from IR (See PDS Octet 41 ... for specific satellite ID)',
            06: 'NCEP/ARL Dust Model',
            //07-09: 'Reserved',
            10: 'Global Wind-Wave Forecast Model',
            11: 'Global Multi-Grid Wave Model (Static Grids)',
            12: 'Probabilistic Storm Surge (P-Surge)',
            13: 'Hurricane Multi-Grid Wave Model',
            14: 'Extra-tropical Storm Surge Atlantic Domain',
            15: 'Nearshore Wave Prediction System (NWPS)',
            16: 'Extra-Tropical Storm Surge (ETSS)',
            17: 'Extra-tropical Storm Surge Pacific Domain',
            18: 'Probabilistic Extra-Tropical Storm Surge (P-ETSS)',
            19: 'Limited-area Fine Mesh (LFM) analysis',
            20: 'Extra-tropical Storm Surge Micronesia Domain',
            //21-24: 'Reserved',
            25: 'Snow Cover Analysis',
            //26-29: 'Reserved',
            30: 'Forecaster generated field',
            31: 'Value added post processed field',
            //32-41: 'Reserved',
            42: 'Global Optimum Interpolation Analysis (GOI) from GFS model',
            43: 'Global Optimum Interpolation Analysis (GOI) from \'Final\' run ',
            44: 'Sea Surface Temperature Analysis',
            45: 'Coastal Ocean Circulation Model',
            46: 'HYCOM - Global',
            47: 'HYCOM - North Pacific basin',
            48: 'HYCOM - North Atlantic basin',
            49: 'Ozone Analysis from TIROS Observations ',
            //50-51: 'Reserved',
            52: 'Ozone Analysis from Nimbus 7 Observations ',
            53: 'LFM-Fourth Order Forecast Model',
            //54-63: 'Reserved',
            64: 'Regional Optimum Interpolation Analysis (ROI)',
            //65-67: 'Reserved',
            68: '80 wave triangular, 18-layer Spectral model from GFS model',
            69: '80 wave triangular, 18 layer Spectral model from \'Medium Range Forecast\' run',
            70: 'Quasi-Lagrangian Hurricane Model (QLM)',
            71: 'Hurricane Weather Research and Forecasting (HWRF) Model',
            72: 'Hurricane Non-Hydrostatic Multiscale Model on the B Grid (HNMMB)',
            73: 'Fog Forecast model - Ocean Prod. Center',
            74: 'Gulf of Mexico Wind/Wave',
            75: 'Gulf of Alaska Wind/Wave',
            76: 'Bias corrected Medium Range Forecast',
            77: '126 wave triangular, 28 layer Spectral model from GFS model',
            78: '126 wave triangular, 28 layer Spectral model from \'Medium Range Forecast\' run',
            79: 'Backup from the previous run',
            80: '62 wave triangular, 28 layer Spectral model from \'Medium Range Forecast\' run',
            81: 'Analysis from GFS (Global Forecast System)',
            82: 'Analysis from GDAS (Global Data Assimilation System)',
            83: 'High Resolution Rapid Refresh (HRRR)',
            84: 'MESO NAM Model (currently 12 km)',
            85: 'Real Time Ocean Forecast System (RTOFS)',
            86: 'Early Hurricane Wind Speed Probability Model',
            87: 'CAC Ensemble Forecasts from Spectral (ENSMB)',
            88: 'NOAA Wave Watch III (NWW3) Ocean Wave Model',
            89: 'Non-hydrostatic Meso Model (NMM) (Currently 8 km)',
            90: '62 wave triangular, 28 layer spectral model extension of the \'Medium Range Forecast\' run',
            91: '62 wave triangular, 28 layer spectral model extension of the GFS model',
            92: '62 wave triangular, 28 layer spectral model run from the \'Medium Range Forecast\' final analysis',
            93: '62 wave triangular, 28 layer spectral model run from the T62 GDAS analysis of the \'Medium Range Forecast\' run',
            94: 'T170/L42 Global Spectral Model from MRF run',
            95: 'T126/L42 Global Spectral Model from MRF run',
            96: 'Global Forecast System ModelT1534 - Forecast hours 00-384\nT574 - Forecast hours 00-192\nT190 - Forecast hours 204-384\n',
            97: 'Reserved',
            98: 'Climate Forecast System Model -- Atmospheric model (GFS) coupled to a multi level ocean model .   Currently GFS spectral model at T62, 64 levels coupled to 40 level MOM3 ocean model.',
            99: 'Miscellaneous Test ID',
            100: 'Miscellaneous Test ID',
            101: 'Conventional Observation Re-Analysis (CORE)',
            //102-103: 'Reserved',
            104: 'National Blend GRIB',
            105: 'Rapid Refresh (RAP)',
            106: 'Reserved',
            107: 'Global Ensemble Forecast System (GEFS)',
            108: 'LAMP',
            109: 'RTMA (Real Time Mesoscale Analysis)',
            110: 'NAM Model - 15km version',
            111: 'NAM model, generic resolution (Used in SREF processing)',
            112: 'WRF-NMM model, generic resolution (Used in various runs) NMM=Nondydrostatic Mesoscale Model (NCEP)',
            113: 'Products from NCEP SREF processing',
            114: 'NAEFS Products from joined NCEP, CMC global ensembles',
            115: 'Downscaled GFS from NAM eXtension',
            116: 'WRF-EM model, generic resolution (Used in various runs) EM - Eulerian Mass-core (NCAR - aka Advanced Research WRF)',
            117: 'NEMS GFS Aerosol Component',
            118: 'URMA (UnRestricted Mesoscale Analysis)',
            119: 'WAM (Whole Atmosphere Model)',
            120: 'Ice Concentration Analysis',
            121: 'Western North Atlantic Regional Wave Model',
            122: 'Alaska Waters Regional Wave Model',
            123: 'North Atlantic Hurricane Wave Model',
            124: 'Eastern North Pacific Regional Wave Model',
            125: 'North Pacific Hurricane Wave Model',
            126: 'Sea Ice Forecast Model',
            127: 'Lake Ice Forecast Model',
            128: 'Global Ocean Forecast Model',
            129: 'Global Ocean Data Analysis System (GODAS)',
            130: 'Merge of fields from the RUC, NAM, and Spectral Model ',
            131: 'Great Lakes Wave Model',
            132: 'High Resolution Ensemble Forecast (HREF)',
            133: 'Great Lakes Short Range Wave Model',
            134: 'Rapid Refresh Forecast System (RRFS)',
            135: 'Hurricane Analysis and Forecast System (HAFS)',
            //135-139: 'Reserved',
            140: 'North American Regional Reanalysis (NARR)',
            141: 'Land Data Assimilation and Forecast System',
            //142-149: 'Reserved',
            150: 'NWS River Forecast System (NWSRFS)',
            151: 'NWS Flash Flood Guidance System (NWSFFGS)',
            152: 'WSR-88D Stage II Precipitation Analysis',
            153: 'WSR-88D Stage III Precipitation Analysis',
            //154-179: 'Reserved',
            180: 'Quantitative Precipitation Forecast generated by NCEP',
            181: 'River Forecast Center Quantitative Precipitation Forecast mosaic generated by NCEP',
            182: 'River Forecast Center Quantitative Precipitation estimate mosaic generated by NCEP',
            183: 'NDFD product generated by NCEP/HPC',
            184: 'Climatological Calibrated Precipitation Analysis - CCPA',
            //185-189: 'Reserved',
            190: 'National Convective Weather Diagnostic generated by NCEP/AWC',
            191: 'Current Icing Potential automated product genterated by NCEP/AWC',
            192: 'Analysis product from NCEP/AWC',
            193: 'Forecast product from NCEP/AWC',
            194: 'Reserved',
            195: 'Climate Data Assimilation System 2 (CDAS2)',
            196: 'Climate Data Assimilation System 2 (CDAS2) - used for regeneration runs',
            197: 'Climate Data Assimilation System (CDAS)',
            198: 'Climate Data Assimilation System (CDAS) - used for regeneration runs',
            199: 'Climate Forecast System Reanalysis (CFSR) -- Atmospheric model (GFS) coupled to a multi level ocean, land and seaice model.   Currently GFS spectral model at T382, 64 levels coupled to 40 level MOM4 ocean model.',
            200: 'CPC Manual Forecast Product',
            201: 'CPC Automated Product',
            //202-209: 'Reserved',
            210: 'EPA Air Quality Forecast - Currently North East US domain',
            211: 'EPA Air Quality Forecast - Currently Eastern US domain',
            //212-214: 'Reserved',
            215: 'SPC Manual Forecast Product',
            //216-219: 'Reserved',
            220: 'NCEP/OPC automated product',
            //221-230: 'Reserved for WPC products',
            //231-254: 'Reserved',
            255: 'Missing'
        }
    }
    // Static templates
    static templates = {
        // Section 3 - Grid Definition Template Number
        // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect3.shtml
        // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table3-1.shtml
        // Latitude/Longitude (or equidistant cylindrical, or Plate Carree)
        '3.0': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp3-0.shtml 
            {
                startIndex: 15,
                size: 1,
                content: null,
                table: '3.2',
                type: 'uint8',
                info: 'Shape of the Earth (See Code Table 3.2)'
            },
            {
                startIndex: 16,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale Factor of radius of spherical Earth'
            },
            {
                startIndex: 17,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scale value of radius of spherical Earth'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 22,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 26,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 27,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Ni — number of points along a parallel'
            },
            {
                startIndex: 35,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Nj — number of points along a meridian'
            },
            {
                startIndex: 39,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Basic angle of the initial production domain (see Note 1)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Subdivisions of basic angle used to define extreme longitudes and latitudes, and direction increments (see Note 1)'
            },
            {
                startIndex: 47,
                size: 4,
                content: null,
                type: 'uint32',
                regulation: '92.1.5',
                info: 'La1 — latitude of first grid point (see Note 1)'
            },
            {
                startIndex: 51,
                size: 4,
                content: null,
                type: 'uint32',
                regulation: '92.1.5',
                info: 'Lo1 — longitude of first grid point (see Note 1)'
            },
            {
                startIndex: 55,
                size: 1,
                content: null,
                flagTable: '3.3',
                type: 'uint8',
                info: 'Resolution and component flags (see Flag Table 3.3)'
            },
            {
                startIndex: 56,
                size: 4,
                content: null,
                type: 'uint32',
                regulation: '92.1.5',
                info: 'La2 — latitude of last grid point (see Note 1)'
            },
            {
                startIndex: 60,
                size: 4,
                content: null,
                type: 'uint32',
                regulation: '92.1.5',
                info: 'Lo2 — longitude of last grid point (see Note 1)'
            },
            {
                startIndex: 64,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Di — i direction increment (see Notes 1 and 5)'
            },
            {
                startIndex: 68,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Dj — j direction increment (see Note 1 and 5)'
            },
            {
                startIndex: 72,
                size: 1,
                content: null,
                flagTable: '3.4',
                type: 'uint8',
                info: 'Scanning mode (flags — see Flag Table 3.4 and Note 6)'
            },
            {
                startIndex: 73,
                size: 'end', // from 73 to nn
                content: null,
                type: 'uint8',
                info: 'List of number of points along each meridian or parallel (These octets are only present for quasi-regular grids as described in notes 2 and 3)'
            }
            // Notes
            // 1.  Basic angle of the initial production domain and subdivisions of this basic angle are provided to manage cases where the recommended unit of 10^-6 degrees is not applicable to describe the extreme longitudes and latitudes, and direction increments. For these last six descriptors, the unit is equal to the ratio of the basic angle and the subdivisions number. For ordinary cases, zero and missing values should be coded, equivalent to respective values of 1 and 10^6  (10^-6  degrees unit).
            // 2.  For data on a quasi-regular grid, in which all the rows or columns do not necessarily have the same number of grid points either Ni (octets 31-34) of Nj (octets 35-38) and the corresponding Di (octets 64-67) or Dj (octets 68-71) shall be coded with all bits set to 1 (missing). The actual number of points along each parallel or meridian shall be coded in the octets immediately following the grid definition template (octets [xx+1]-nn), as described in the description of the grid definition section.
            // 3.  A quasi-regular grid is only defined for appropriate grid scanning modes. Either rows or columns, but not both simultaneously, may have variable numbers of points or variable spacing. The first point in each row (column) shall be positioned at the meridian (parallel) indicted by octets 47-54. The grid points shall be evenly spaced in latitude (longitude).
            // 4.  A scale value of radius of spherical Earth, or major axis of oblate spheroid Earth is delivered from applying appropriate scale factor to the value expressed in meters.
            // 5.  It is recommended to use unsigned direction increments.
            // 6.  In most cases, multiplying Ni (octets 31-34) by Nj (octets 35-38) yields the total number of points in the grid. However, this may not be true if bit 8 of the scanning mode flags (octet 72) is set to 1.
        ],
        // Rotate Latitude/Longitude (or equidistant cylindrical, or Plate Carree)
        '3.1': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp3-1.shtml
            {
                startIndex: 15,
                size: 1,
                content: null,
                table: '3.2',
                type: 'uint8',
                info: 'Shape of the Earth (See Code Table 3.2)'
            },
            {
                startIndex: 16,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale Factor of radius of spherical Earth'
            },
            {
                startIndex: 17,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scale value of radius of spherical Earth'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 22,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 26,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 27,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Ni — number of points along a parallel'
            },
            {
                startIndex: 35,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Nj — number of points along a meridian'
            },
            {
                startIndex: 39,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Basic angle of the initial production domain (see Note 1)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Subdivisions of basic angle used to define extreme longitudes and latitudes, and direction increments (see Note 1)'
            },
            {
                startIndex: 47,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La1 — latitude of first grid point (see Note 1)'
            },
            {
                startIndex: 51,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo1 — longitude of first grid point (see Note 1)'
            },
            {
                startIndex: 55,
                size: 1,
                content: null,
                flagTable: '3.3',
                type: 'uint8',
                info: 'Resolution and component flags (see Flag Table 3.3)'
            },
            {
                startIndex: 56,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La2 — latitude of last grid point (see Note 1)'
            },
            {
                startIndex: 60,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo2 — longitude of last grid point (see Note 1)'
            },
            {
                startIndex: 64,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Di — i direction increment (see Notes 1 and 4)'
            },
            {
                startIndex: 68,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Dj — j direction increment (see Note 1 and 4)'
            },
            {
                startIndex: 72,
                size: 1,
                content: null,
                flagTable: '3.4',
                type: 'uint8',
                info: 'Scanning mode (flags — see Flag Table 3.4 and Note 6)'
            },
            {
                startIndex: 73,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 77,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 81,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Angle of rotation of projection'
            },
            {
                startIndex: 85,
                size: 'end', // from 85 to nn
                content: null,
                type: 'uint32',
                info: 'List of number of points along each meridian or parallel (These octets are only present for quasi-regular grids as described in note 3)'
            },
            // Notes
            // 1.  Basic angle of the initial production domain and subdivisions of this basic angle are provided to manage cases where the recommended unit of 10^-6 degrees is not applicable to describe the extreme longitudes and latitudes, and direction increments. For these last six descriptors, the unit is equal to the ratio of the basic angle and the subdivisions number. For ordinary cases, zero and missing values should be coded, equivalent to respective values of 1 and 10^6  (10^-6  degrees unit).
            // 2.  Three parameters define a general latitude/longitude coordinate system, formed by a general rotation of the sphere. One choice for these parameters is: (a) The geographic latitude in degrees of the southern pole of the coordinate system,06 for example. (b) The geographic longitude in degrees of the southern pole of the coordinate system,λp for example. (c) The angle of rotation in degrees about the new polar axis (measured clockwise when looking from the southern to the northern pole) of the coordinate system, assuming the new axis to have been obtained by first rotating the sphere through λp degrees about the geographic polar axis and then rotating through (90 + 0p) degrees so that the southern pole moved along the (previously rotated) Greenwich meridian.
            // 3.  A quasi-regular grid is only defined for appropriate grid scanning modes. Either rows or columns, but not both simultaneously, may have variable numbers of points or variable spacing. The first point in each row (column) shall be positioned at the meridian (parallel) indicted by octets 47-54. The grid points shall be evenly spaced in latitude (longitude).
            // 4.  It is recommended to use unsigned direction increments.
        ],
        // Stretched Latitude/Longitude (or equidistant cylindrical, or Plate Carree)
        '3.2': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp3-2.shtml
            {
                startIndex: 15,
                size: 1,
                content: null,
                table: '3.2',
                type: 'uint8',
                info: 'Shape of the Earth (See Code Table 3.2)'
            },
            {
                startIndex: 16,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale Factor of radius of spherical Earth'
            },
            {
                startIndex: 17,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scale value of radius of spherical Earth'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 22,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 26,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 27,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Ni — number of points along a parallel'
            },
            {
                startIndex: 35,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Nj — number of points along a meridian'
            },
            {
                startIndex: 39,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Basic angle of the initial production domain (see Note 1)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Subdivisions of basic angle used to define extreme longitudes and latitudes, and direction increments (see Note 1)'
            },
            {
                startIndex: 47,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La1 — latitude of first grid point (see Note 1)'
            },
            {
                startIndex: 51,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo1 — longitude of first grid point (see Note 1)'
            },
            {
                startIndex: 55,
                size: 1,
                content: null,
                flagTable: '3.3',
                type: 'uint8',
                info: 'Resolution and component flags (see Flag Table 3.3)'
            },
            {
                startIndex: 56,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La2 — latitude of last grid point (see Note 1)'
            },
            {
                startIndex: 60,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo2 — longitude of last grid point (see Note 1)'
            },
            {
                startIndex: 64,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Di — i direction increment (see Notes 1 and 4)'
            },
            {
                startIndex: 68,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Dj — j direction increment (see Note 1 and 4)'
            },
            {
                startIndex: 72,
                size: 1,
                content: null,
                flagTable: '3.4',
                type: 'uint8',
                info: 'Scanning mode (flags — see Flag Table 3.4)'
            },
            {
                startIndex: 73,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 77,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 81,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Angle of rotation of projection'
            },
            {
                startIndex: 85,
                size: 'end', // from 85 to nn
                content: null,
                type: 'uint32',
                info: 'List of number of points along each meridian or parallel (These octets are only present for quasi-regular grids as described in note 3)'
            },
            // Notes
            // 1.  Basic angle of the initial production domain and subdivisions of this basic angle are provided to manage cases where the recommended unit of 10^-6 degrees is not applicable to describe the extreme longitudes and latitudes, and direction increments. For these last six descriptors, the unit is equal to the ratio of the basic angle and the subdivisions number. For ordinary cases, zero and missing values should be coded, equivalent to respective values of 1 and 10^6  (10^-6  degrees unit).
            // 2. The stretching is defined by three parameters: (a) The latitude in degrees (measured in the model coordinate system) of the "pole of stretching"; (b) The longitude in degrees (measured in the model coordinate system) of the "pole of stretching"; and (c) The stretching factor C in units of 10-6 represented as an integer. The stretching is defined by representing data uniformly in a coordinate system with longitudeq λ and latitude θ1, where: θ 1 = sin-1[(1- C2) + (1 + C2) sin θ] / [(1 + C2) + (1 - C2) sin θ ] and λ and θ are longitude and latitude in a coordinate system in which the "pole of stretching" is the northern pole. C = 1 gives uniform resolution, while C > 1 gives enhanced resolution around the pole of stretching.
            // 3.  A quasi-regular grid is only defined for appropriate grid scanning modes. Either rows or columns, but not both simultaneously, may have variable numbers of points or variable spacing. The first point in each row (column) shall be positioned at the meridian (parallel) indicted by octets 47-54. The grid points shall be evenly spaced in latitude (longitude).
            // 4.  It is recommended to use unsigned direction increments.
        ],
        // Stretched and Rotate Latitude/Longitude (or equidistant cylindrical, or Plate Carree)
        '3.3': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp3-3.shtml
            {
                startIndex: 15,
                size: 1,
                content: null,
                table: '3.2',
                type: 'uint8',
                info: 'Shape of the Earth (See Code Table 3.2)'
            },
            {
                startIndex: 16,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale Factor of radius of spherical Earth'
            },
            {
                startIndex: 17,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scale value of radius of spherical Earth'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 22,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 26,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 27,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Ni — number of points along a parallel'
            },
            {
                startIndex: 35,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Nj — number of points along a meridian'
            },
            {
                startIndex: 39,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Basic angle of the initial production domain (see Note 1)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Subdivisions of basic angle used to define extreme longitudes and latitudes, and direction increments (see Note 1)'
            },
            {
                startIndex: 47,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La1 — latitude of first grid point (see Note 1)'
            },
            {
                startIndex: 51,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo1 — longitude of first grid point (see Note 1)'
            },
            {
                startIndex: 55,
                size: 1,
                content: null,
                flagTable: '3.3',
                type: 'uint8',
                info: 'Resolution and component flags (see Flag Table 3.3)'
            },
            {
                startIndex: 56,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La2 — latitude of last grid point (see Note 1)'
            },
            {
                startIndex: 60,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo2 — longitude of last grid point (see Note 1)'
            },
            {
                startIndex: 64,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Di — i direction increment (see Notes 1 and 4)'
            },
            {
                startIndex: 68,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Dj — j direction increment (see Note 1 and 4)'
            },
            {
                startIndex: 72,
                size: 1,
                content: null,
                flagTable: '3.4',
                type: 'uint8',
                info: 'Scanning mode (flags — see Flag Table 3.4)'
            },
            {
                startIndex: 73,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 77,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 81,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Angle of rotation of projection'
            },
            {
                startIndex: 85,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the pole of stretching'
            },{
                startIndex: 89,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Longitude of the pole stretching'
            },{
                startIndex: 93,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Stretching factor'
            },
            {
                startIndex: 97,
                size: 'end', // from 85 to nn
                content: null,
                type: 'uint32',
                info: 'List of number of points along each meridian or parallel (These octets are only present for quasi-regular grids as described in note 3)'
            },
            // Notes
            // 1.  Basic angle of the initial production domain and subdivisions of this basic angle are provided to manage cases where the recommended unit of 10^-6 degrees is not applicable to describe the extreme longitudes and latitudes, and direction increments. For these last six descriptors, the unit is equal to the ratio of the basic angle and the subdivisions number. For ordinary cases, zero and missing values should be coded, equivalent to respective values of 1 and 10^6  (10^-6  degrees unit).
            // 2. See Note (2) under grid definition template 3.1 ― rotated latitude/longitude (or equidistant cylindrical, or Plate Carree).
            // 3.  See Note (2) under grid definition template 3.2 ― stretched latitude/longitude (or equidistant cylindrical, or Plate Carree).
            // 4. A quasi-regular grid is only defined for appropriate grid scanning modes. Either rows or columns, but not both simultaneously, may have variable numbers of points or variable spacing. The first point in each row (column) shall be positioned at the meridian (parallel) indicted by octets 47-54. The grid points shall be evenly spaced in latitude (longitude).
            // 5.  It is recommended to use unsigned direction increments.
        ],
        // Variable Resolution Latitude/Longitude
        '3.4': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp3-4.shtml
            {
                startIndex: 15,
                size: 1,
                content: null,
                table: '3.2',
                type: 'uint8',
                info: 'Shape of the Earth (See Code Table 3.2)'
            },
            {
                startIndex: 16,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale Factor of radius of spherical Earth'
            },
            {
                startIndex: 17,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scale value of radius of spherical Earth'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 22,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 26,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 27,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Ni — number of points along a parallel'
            },
            {
                startIndex: 35,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Nj — number of points along a meridian'
            },
            {
                startIndex: 39,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Basic angle of the initial production domain (see Note 1)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Subdivisions of basic angle used to define extreme longitudes and latitudes, and direction increments (see Note 1)'
            },
            {
                startIndex: 47,
                size: 1,
                content: null,
                flagTable: '3.3',
                type: 'uint8',
                info: 'Resolution and component flags (see Flag Table 3.3)'
            },
            {
                startIndex: 48,
                size: 1,
                content: null,
                flagTable: '3.4',
                type: 'uint8',
                info: 'Scanning mode (flags — see Flag Table 3.4)'
            },
            {
                startIndex: 49,
                size: 'calc', // from 49 to ii; ii=48+4Ni and jj=48+4Ni+4j.
                sizeRef: {
                    index: 31,
                    calc: (ni) => ni*4
                },
                content: null,
                type: 'uint32',
                info: 'List of Longitudes (see Notes 1 and 3)'
            },
            {
                startIndex: 'nextAvailable',
                size: 'end', // from ii+1 to jj;  jj=48+4Ni+4j --> 4j or 4Nj????
                content: null,
                type: 'uint32',
                info: 'List of Latitudes (see Notes 1 and 3)'
            }
            // Notes
            // 1.  Basic angle of the initial production domain and subdivisions of this basic angle are provided to manage cases where the recommended unit of 10^-6 degrees is not applicable to describe the extreme longitudes and latitudes, and direction increments. For these last six descriptors, the unit is equal to the ratio of the basic angle and the subdivisions number. For ordinary cases, zero and missing values should be coded, equivalent to respective values of 1 and 10^6  (10^-6  degrees unit).
            // 2. For resolution flag (bit 3-4 of Flag table 3.3) is not applicable.
            // 3. The list of Ni longitudes and Nj latitudes shall be coded in the octets immediately following the Grid definition template in octets 49 to ii and octets ii+1 to jj respectively, where ii=48+4Ni and jj=48+4Ni+4j.
            // 4. A scale value of radius of spherical Earth, or major or minor axis of oblate spheroid Earth is derived from applying appropriate scale factor to the value expressed in meters.
        ],
        // TODO: Templates
        // Variable Resolution Rotate Latitude/Longitude
        '3.5': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp3-5.shtml
            {
                startIndex: 15,
                size: 1,
                content: null,
                table: '3.2',
                type: 'uint8',
                info: 'Shape of the Earth (See Code Table 3.2)'
            },
            {
                startIndex: 16,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale Factor of radius of spherical Earth'
            },
            {
                startIndex: 17,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scale value of radius of spherical Earth'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 22,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 26,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 27,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Ni — number of points along a parallel'
            },
            {
                startIndex: 35,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Nj — number of points along a meridian'
            },
            {
                startIndex: 39,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Basic angle of the initial production domain (see Note 1)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Subdivisions of basic angle used to define extreme longitudes and latitudes, and direction increments (see Note 1)'
            },
            {
                startIndex: 47,
                size: 1,
                content: null,
                flagTable: '3.3',
                type: 'uint8',
                info: 'Resolution and component flags (see Flag Table 3.3)'
            },
            {
                startIndex: 48,
                size: 1,
                content: null,
                flagTable: '3.4',
                type: 'uint8',
                info: 'Scanning mode (flags — see Flag Table 3.4)'
            },
            {
                startIndex: 49,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 53,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Latitude of the southern pole of projection'
            },
            {
                startIndex: 57,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Angle of rotation of projection'
            },
            {
                startIndex: 61,
                size: 'calc', // from 61 to ii; ii=60+4Ni and jj=60+4Ni+4j.
                sizeRef: {
                    index: 31,
                    calc: (ni) => ni*4
                },
                content: null,
                type: 'uint32',
                info: 'List of Longitudes (see Notes 1 and 3)'
            },
            {
                startIndex: 'nextAvailable',
                size: 'end', // from ii+1 to jj;  jj=48+4Ni+4j --> 4j or 4Nj???? TODO (also appears in 3.4)
                content: null,
                type: 'uint32',
                info: 'List of Latitudes (see Notes 1 and 3)'
            }
            // Notes
            // 1.  Basic angle of the initial production domain and subdivisions of this basic angle are provided to manage cases where the recommended unit of 10^-6 degrees is not applicable to describe the extreme longitudes and latitudes, and direction increments. For these last six descriptors, the unit is equal to the ratio of the basic angle and the subdivisions number. For ordinary cases, zero and missing values should be coded, equivalent to respective values of 1 and 10^6  (10^-6  degrees unit).
            // 2. Three parameters define a general Latitude/Longitude coordinate system, formed by a general rotation of the sphere. One choice for these parameters is: (a)   The geographic latitude in degrees of the Southern pole of the coordinate system, e.g Θp; (b)   The geographic longitude in degrees of the Southern pole of the coordinate system, e.g λp; (c)   The angle of rotation in degrees about the new polar axis (measured clockwise when looking from the Southern to the Northern pole) of the coordinate system, assuming the new axis to have been obtained by first rotating the sphere through λp degrees about the geographic polar aixs, and then rotating through (90 + Θp) degrees so that the Southern pole moved along the (previously rotated) Greenwich meridian.
            // 3. For the list of Ni longitudes bounds and Nj latitudes bounds at the end of the section ii=60+4Ni and jj=60+4Ni+4Nj.
            // 4. Regulations 92.1.6 applies.
        ],
        // Mercator
        '3.10': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp3-10.shtml
            {
                startIndex: 15,
                size: 1,
                content: null,
                table: '3.2',
                type: 'uint8',
                info: 'Shape of the Earth (See Code Table 3.2)'
            },
            {
                startIndex: 16,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale Factor of radius of spherical Earth'
            },
            {
                startIndex: 17,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scale value of radius of spherical Earth'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 22,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of major axis of oblate spheroid Earth'
            },
            {
                startIndex: 26,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 27,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of minor axis of oblate spheroid Earth'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Ni — number of points along a parallel'
            },
            {
                startIndex: 35,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Nj — number of points along a meridian'
            },
            {
                startIndex: 39,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La1 ― latitude of first grid point'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo1 ― longitude of first grid point'
            },
            {
                startIndex: 47,
                size: 1,
                content: null,
                flagTable: '3.3',
                type: 'uint8',
                info: 'Resolution and component flags (see Flag Table 3.3)'
            },
            {
                startIndex: 48,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'LaD — latitude(s) at which the Mercator projection intersects the Earth (Latitude(s) where Di and Dj are specified)  '
            },
            {
                startIndex: 52,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'La2 ― latitude of last grid point'
            },
            {
                startIndex: 56,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Lo2 — longitude of last grid point'
            },
            {
                startIndex: 60,
                size: 1,
                content: null,
                flagTable: '3.4',
                type: 'uint8',
                info: 'Scanning mode (flags — see Flag Table 3.4)'
            },
            {
                startIndex: 61,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Orientation of the grid, angle between i direction on the map and the Equator (see Note1)'
            },
            {
                startIndex: 65,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Dj — longitudinal direction grid length (see Note 2)'
            },
            {
                startIndex: 69,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Dj ― latitudinal direction grid length  (see Note 2)'
            },
            {
                startIndex: 73,
                size: 'end', // from 73 to nn
                content: null,
                type: 'uint32',
                info: 'List of number of points along each meridian or parallel (These octets are only present for quasi-regular grids as described in notes 2 and 3 of GDT 3.1)'
            },
            // Notes: 
            // 1.  Limited to the range of  0 to 90 degrees; if the angle of orientation of the grid is neither 0 nor 90 degrees, Di and Dj must be equal to each other.
            // 2.  Grid lengths are in units of 10^-3  m, at the latitude specified by LaD.
            // 3.  A scale value of radius of spherical Earth, or major or minor axis of oblate spheroid Earth is derived from applying appropriate scale factor to the value expressed in metres.
        ],
        // 
        '3.12': [ // 

        ],
        // 
        '3.13': [ // 

        ],
        // 
        '3.20': [ // 

        ],
        // 
        '3.23': [ // 

        ],
        // 
        '3.30': [ // 

        ],
        // 
        '3.31': [ // 

        ],
        //... and many more

        // Section 4 - Product Definition Section
        // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect4.shtml
        // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table4-0.shtml
        // TODO
        // Analysis or forecast at a horizontal level or in a horizontal layer at a point in time
        '4.0': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp4-0.shtml
            {
                startIndex: 10,
                size: 1,
                content: null,
                table: '4.1', // TODO: code tables and parse codeTableRef (for all this section)
                type: 'uint8',
                info: 'Parameter category (see Code table 4.1)'
            },
            {
                startIndex: 11,
                size: 1,
                content: null,
                table: '4.1', 
                type: 'uint8',
                info: 'Parameter number (see Code table 4.2)'
            },
            {
                startIndex: 12,
                size: 1,
                content: null,
                table: '4.3', 
                type: 'uint8',
                info: 'Type of generating process (see Code table 4.3)'
            },
            {
                startIndex: 13,
                size: 1,
                content: null,
                table: '4.1', 
                type: 'uint8',
                info: 'Background generating process identifier (defined by originating centre)'
            },
            {
                startIndex: 14,
                size: 1,
                content: null,
                table: 'ON388 Table A',
                type: 'uint8',
                info: 'Analysis or forecast generating process identified (see Code ON388 Table A)'
            },
            {
                startIndex: 15,
                size: 2,
                content: null,
                type: 'uint16',
                info: 'Hours of observational data cutoff after reference time (see Note)'
            },
            {
                startIndex: 17,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Minutes of observational data cutoff after reference time (see Note)'
            },
            {
                startIndex: 18,
                size: 1,
                content: null,
                table: '4.4', 
                type: 'uint8',
                info: 'Indicator of unit of time range (see Code table 4.4)'
            },
            {
                startIndex: 19,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Forecast time in units defined by octet 18'
            },
            {
                startIndex: 23,
                size: 1,
                content: null,
                table: '4.5', 
                type: 'uint8',
                info: 'Type of first fixed surface (see Code table 4.5)'
            },
            {
                startIndex: 24,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of first fixed surface'
            },
            {
                startIndex: 25,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of first fixed surface'
            },
            {
                startIndex: 29,
                size: 1,
                content: null,
                table: '4.5',
                type: 'uint8',
                info: 'Type of second fixed surfaced (see Code table 4.5)'
            },
            {
                startIndex: 30,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Scale factor of second fixed surface'
            },
            {
                startIndex: 31,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Scaled value of second fixed surfaces'
            }
        ],
        // 
        '4.1': [ // 

        ],
        // 
        '4.2': [ // 

        ],
        // 
        '4.3': [ // 

        ],
        // 
        '4.4': [ // 

        ],
        // 
        '4.5': [ // 

        ],
        // 
        '4.6': [ // 

        ],

        // 
        '4.7': [ // 

        ],
        // Average, Accumulation and/or Extreme values or other Statistically- processed values at a horizontal level or in a horizontal layer in a continuous or non - continuous time interval
        '4.8': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp4-8.shtml
            {
                info: 'Parameter category (see Code Table 4.1)',
                startIndex: 10,
                table: '4.1',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Parameter number (see Code Table 4.2)',
                startIndex: 11,
                table: '4.2',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Type of generating process (see Code Table 4.3)',
                startIndex: 12,
                table: '4.3',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Background generating process identifier (defined by originating centre)',
                startIndex: 13,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Analysis or forecast generating process identified (see Code ON388 Table A)',
                startIndex: 14,
                table: 'ON388 Table A',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Hours after reference time data cutoff (see Note 1)',
                startIndex: 15,
                size: 2,
                type: 'uint16',
                content: null
            },
            {
                info: 'Minutes after reference time data cutoff',
                startIndex: 17,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Indicator of unit of time range (see Code Table 4.4)',
                startIndex: 18,
                table: '4.4',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Forecast time in units defined by octet 18 (see Note 2)',
                startIndex: 19,
                size: 4,
                type: 'uint32',
                content: null
            },
            {
                info: 'Type of first fixed surface (see Code Table 4.5)',
                startIndex: 23,
                table: '4.5',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Scale factor of first fixed surface',
                startIndex: 24,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Scaled value of first fixed surface',
                startIndex: 25,
                size: 4,
                type: 'uint32',
                content: null
            },
            {
                info: 'Type of second fixed surfaced (see Code Table 4.5)',
                startIndex: 29,
                table: '4.5',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Scale factor of second fixed surface',
                startIndex: 30,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Scaled value of second fixed surfaces',
                startIndex: 31,
                size: 4,
                type: 'uint32',
                content: null
            },
            {
                info: 'Year  ― Time of end of overall time interval',
                startIndex: 35,
                size: 2,
                type: 'uint16',
                content: null
            },
            {
                info: 'Month  ― Time of end of overall time interval',
                startIndex: 37,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Day  ― Time of end of overall time interval',
                startIndex: 38,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Hour  ― Time of end of overall time interval',
                startIndex: 39,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Minute  ― Time of end of overall time interval',
                startIndex: 40,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Second  ― Time of end of overall time interval',
                startIndex: 41,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'n ― number of time ranges specifications describing the time intervals used to calculate the statistically-processed field',
                startIndex: 42,
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Total number of data values missing in statistical process',
                startIndex: 43,
                size: 4,
                type: 'uint32',
                content: null
            },
            // 47 - 58 Specification of the outermost (or only) time range over which statistical processing is done
            {
                info: 'Statistical process used to calculate the processed field from the field at each time increment during the time range (see Code Table 4.10)',
                startIndex: 47,
                table: '4.10',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Type of time increment between successive fields used in the statistical processing (see Code Table 4.11)',
                startIndex: 48,
                table: '4.11',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Indicator of unit of time for time range over which statistical processing is done (see Code Table 4.4)',
                startIndex: 49,
                table: '4.4',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Length of the time range over which statistical processing is done, in units defined by the previous octet',
                startIndex: 50,
                size: 4,
                type: 'uint32',
                content: null
            },
            {
                info: 'Indicator of unit of time for the increment between the successive fields used (see Code Table 4.4)',
                startIndex: 54,
                table: '4.4',
                size: 1,
                type: 'uint8',
                content: null
            },
            {
                info: 'Time increment between successive fields, in units defined by the previous octet (see Notes 3 and 4) ',
                startIndex: 55,
                size: 4,
                type: 'uint32',
                content: null
            },
            // 59 - nn These octets are included only if n>1, where nn = 46 + 12 x n
            {
                info: 'As octets 47 to 58, next innermost step of processing',
                startIndex: 59,
                size: 12,
                type: 'uint8',
                content: null
            },
            {
                info: 'Additional time range specifications, included in accordance with the value of n. Contents as octets 47 to 58, repeated as necessary',
                startIndex: 71,
                size: 'end',
                type: 'uint8',
                content: null
            }
        ],
        // 
        '4.9': [ // 

        ],
        // 
        '4.10': [ // 

        ],
        // 
        '4.11': [ // 

        ],
        // 
        '4.12': [ // 

        ],
        // 
        '4.13': [ // 

        ],
        // 
        '4.14': [ // 

        ],
        // 
        '4.15': [ // 

        ],
        // 
        '4.20': [ // 

        ],
        // 
        '4.30': [ // 

        ],
        // ... and many more TODO

        // Section 5 - Data Representation
        // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect5.shtml
        // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-0.shtml
        
        // Grid point data - simple packing
        '5.0': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-0.shtml
            // https://apps.ecmwf.int/codes/grib/format/grib2/regulations/
            {
                startIndex: 12,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Reference value (R) (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 16,
                size: 2,
                content: null,
                type: 'int16',
                regulation: '92.1.5',
                info: 'Binary scale factor (E)'
            },
            {
                startIndex: 18,
                size: 2,
                content: null,
                type: 'int16',
                regulation: '92.1.5',
                info: 'Decimal scale factor (D)'
            },
            {
                startIndex: 20,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for each packed value for simple packing, or for each group reference value for complex packing or spatial differencing'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                table: '5.1',
                type: 'uint8',
                info: 'Type of original field values (see Code Table 5.1)'
            }
        ],
        // Matrix values at grid point - simple packing
        // Preliminary note:  This template was not validated at the time of publication and should be used with caution.  Please report any use to WMO Secretariat (World Weather Watch - Basic Systems Department) to assist for validation.
        '5.1': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-1.shtml
            {
                startIndex: 12,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Reference value (R) (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 16,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Binary scale factor (E)'
            },
            {
                startIndex: 18,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Decimal scale factor (D)'
            },
            {
                startIndex: 20,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for each packed value for simple packing, or for each group reference value for complex packing or spatial differencing'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                table: '5.1',
                type: 'uint8',
                info: 'Type of original field values (see Code Table 5.1)'
            },
            {
                startIndex: 22,
                size: 1,
                content: null,
                type: 'uint8',
                info: '0, no matrix bit maps present; 1-matrix bit maps present'
            },
            {
                startIndex: 23,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Number of data values encoded in Section 7'
            },
            {
                startIndex: 27,
                size: 2,
                content: null,
                type: 'uint16',
                info: 'NR ― first dimension (rows) of each matrix'
            },
            {
                startIndex: 29,
                size: 2,
                content: null,
                type: 'uint16',
                info: 'NC ― second dimension (columns) of each matrix'
            },
            {
                startIndex: 31,
                size: 1,
                content: null,
                table: '5.2',
                type: 'uint8',
                info: 'First dimension coordinate value definition (see Code Table 5.2)'
            },
            {
                startIndex: 32,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'NC1 ― number of coefficients or values used  to specify first dimension coordinate function'
            },
            {
                startIndex: 33,
                size: 1,
                content: null,
                table: '5.2',
                type: 'uint8',
                info: 'Second dimension coordinate value definition (see Code Table 5.2)'
            },
            {
                startIndex: 34,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'NC2 ― number of coefficients or values used to specify second dimension coordinate function'
            },
            {
                startIndex: 35,
                size: 1,
                content: null,
                table: '5.3',
                type: 'uint8',
                info: 'First dimension physical significance (see Code Table 5.3)'
            },
            {
                startIndex: 36,
                size: 1,
                content: null,
                table: '5.3',
                type: 'uint8',
                info: 'Second dimension physical significance (see Code Table 5.3)'
            },
            {
                startIndex: 37,
                size: 'calc',
                sizeRef: {
                    index: 32,
                    calc: (nc1) => nc1*4
                },
                content: null,
                type: 'float32',
                info: 'Coefficients to define first dimension coordinate values in functional form, or the explicit coordinate values (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 'nextAvailable',
                size: 'end',
                content: null,
                type: 'float32',
                info: 'Coefficients to define second dimension coordinate values in functional form, or the explicit coordinate values (IEEE 32-bit floating-point value)'
            }
            // Notes:
            // (1)   This form of representation enables a matrix of values to be depicted at each grid point; the two dimensions of the matrix may represent coordinates expressed in terms of two elemental parameters (e.g. direction and frequency for wave spectra).  The numeric values of these coordinates,beyond that of simple subscripts, can be given in a functional form, or as a collection of explicit numbers. 
            // (2)   Some simple coordinate functional forms are tabulated in Code table 5.2.  Where a more complex coordinate function applies, the coordinate values shall be explicitly denoted by the inclusion of the actual set of values rather than the coefficients.   This shall be indicated by a code figure 0 from Code table 5.2; the number of explicit values coded shall be equal to the appropriate dimension of the matrix for which values are presented and they shall follow octet 36 in place of coefficients. 
            // (3)   Matrix bit maps will be present only if indicated by octet 22.  If present, there shall be one bit map for each grid point with data values, as defined by the primary bit map in Section 6, each of length (NRxNC) bits: a bit set to 1 will indicate a data element at the corresponding location within the matrix.  Bit maps shall be represented end-to-end, without regard for octet boundaries: the last bit map shall, if necessary, be followed by bits set to zero to fill any partially used octet. 
            // (4)  Matrices restricted to scanning in the +i direction (left to right) and in the -j direction (top to bottom)
        ],
        // Grid point data - complex packing
        '5.2': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-2.shtml
            {
                startIndex: 12,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Reference value (R) (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 16,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Binary scale factor (E)'
            },
            {
                startIndex: 18,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Decimal scale factor (D)'
            },
            {
                startIndex: 20,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for each packed value for simple packing, or for each group reference value for complex packing or spatial differencing'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                table: '5.1',
                type: 'uint8',
                info: 'Type of original field values (see Code Table 5.1)'
            },
            {
                startIndex: 22,
                size: 1,
                content: null,
                table: '5.4',
                type: 'uint8',
                info: 'Group splitting method used (see Code Table 5.4)'
            },
            {
                startIndex: 23,
                size: 1,
                content: null,
                table: '5.5',
                type: 'uint8',
                info: 'Missing value management used (see Code Table 5.5)'
            },
            {
                startIndex: 24,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Primary missing value substitute'
            },
            {
                startIndex: 28,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Secondary missing value substitute'
            },
            {
                startIndex: 32,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'NG ― number of groups of data values into which field is split'
            },
            {
                startIndex: 36,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Reference for group widths (see Note 12)'
            },
            {
                startIndex: 37,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for the group widths (after the reference value in octet 36 has been removed)'
            },
            {
                startIndex: 38,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Reference for group lengths (see Note 13)'
            },
            {
                startIndex: 42,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Length increment for the group lengths (see Note 14)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'True length of last group'
            },
            {
                startIndex: 47,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for the scaled group lengths (after subtraction of the reference value given in octets 38-41 and division by the length increment given in octet 42)'
            }
            // Notes: 
            //(1) Group lengths have no meaning for row by row packing, where groups are coordinate lines (so th grid description section and possibly the bit-map section are enough); for consistency, associated field width and reference should then be encoded as 0.
            //(2) For row by row packing with a bit-map, there should always be as many groups as rows. In case of rows with only missing values, all associated descriptors should be coded as zero.
            //(3) Management of widths into a reference and increments, together with management of lengths as scaled incremental values, are intended to save descriptor size (which is an issue as far as compression gains are concerned). 
            //(4) Management of explicitly missing values is an alternate to bit-map use within Section 6; it is intended to reduce the whole GRIB message size. 
            //(5) There may be two types of missing value(s), such as to make a distinction between static misses (for instance, due to a land/sea mask) and occasional misses. 
            //(6) As an extra option, substitute value(s) for missing data may be specified. If not wished (or not applicable), all bits should be set to 1 for relevant substitute value(s). 
            //(7) If substitute value(s) are specified, type of content should be consistent with appropriate group with original field values (floating-point ― and then IEEE 32-bit encoded-, or integer). 
            //(8) If secondary missing values are used, such values are encoded within appropriate group with all bits set to 1 at packed data level. 
            //(9) If secondary missing values are used, such values are encoded within appropriate group with all bits set to 1, except the last one set to 0, at packed data level. 
            //(10) A group containing only missing values (of either type) will be encoded as a constant group (null width, no associate data) and the group reference will have all bits set to 1 for primary type, and all bits set to 1, except the last bit set to 0, for secondary type. 
            //(11) If necessary, group widths and/or field width of group references may be enlarged to avoid ambiguities between missing value indicator(s) and true data. 
            //(12) The group width is the number of bits used for every value in a group. 
            //(13) The group length (L) is the number of values in a group. 
            //(14) The essence of the complex packing method is to subdivide a field of values into NG groups, where the values in each group have similar sizes. In this procedure, it is necessary to retain enough information to recover the group lengths upon decoding. The NG group lengths for any given field can be described by Ln = ref + Kn x len_inc, n = 1,NG, where ref is given by octets 38 - 41 and len_inc by octet 42. The NG values of K (the scaled group lengths) are stored in the data section, each with the number of bits specified by octet 47. Since the last group is a special case which may not be able to be specified by this relationship, the length of the last group is stored in octets 43-46. 
            //(15) See data template 7.2 and associated notes for complementary information.
        ],
        // Grid point data - complex packing and spatial differencing
        '5.3': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-3.shtml
            {
                startIndex: 12,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Reference value (R) (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 16,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Binary scale factor (E)'
            },
            {
                startIndex: 18,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Decimal scale factor (D)'
            },
            {
                startIndex: 20,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for each packed value for simple packing, or for each group reference value for complex packing or spatial differencing'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                table: '5.1',
                type: 'uint8',
                info: 'Type of original field values (see Code Table 5.1)'
            },
            {
                startIndex: 22,
                size: 1,
                content: null,
                table: '5.4',
                type: 'uint8',
                info: 'Group splitting method used (see Code Table 5.4)'
            },
            {
                startIndex: 23,
                size: 1,
                content: null,
                table: '5.5',
                type: 'uint8',
                info: 'Missing value management used (see Code Table 5.5)'
            },
            {
                startIndex: 24,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Primary missing value substitute'
            },
            {
                startIndex: 28,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Secondary missing value substitute'
            },
            {
                startIndex: 32,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'NG ― number of groups of data values into which field is split'
            },
            {
                startIndex: 36,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Reference for group widths (see Note 12)'
            },
            {
                startIndex: 37,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for the group widths (after the reference value in octet 36 has been removed)'
            },
            {
                startIndex: 38,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'Reference for group lengths (see Note 13)'
            },
            {
                startIndex: 42,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Length increment for the group lengths (see Note 14)'
            },
            {
                startIndex: 43,
                size: 4,
                content: null,
                type: 'uint32',
                info: 'True length of last group'
            },
            {
                startIndex: 47,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for the scaled group lengths (after subtraction of the reference value given in octets 38-41 and division by the length increment given in octet 42)'
            },
            {
                startIndex: 48,
                size: 1,
                content: null,
                table: '5.6',
                type: 'uint8',
                info: 'Order of spatial difference (see Code Table 5.6)'
            },
            {
                startIndex: 49,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of octets required in the data section to specify extra descriptors needed for spatial differencing (octets 6-ww in data template 7.3)'
            }
            // Notes
            // (1) Spatial differencing is a pre-processing before group splitting at encoding time. It is intended to reduce the size of sufficiently smooth fields, when combined with a splitting scheme as described in data representation template 5.2. At order 1, an initial field of values f is replaced by a new field of values g, where g1 = f1, g2 = f2, ..., gn = fn - fn-1. At order 2, the field of values g is itself replaced by a new field of values h, where h1 = f1, h2 = f2 , h3 = g3- g2, ..., hn = gn - gn - 1. To keep values positive, the overall minimum of the resulting field (either gmin or hmin) is removed. At decoding time, after bit string unpacking, the original scaled values are recovered by adding the overall minimum and summing up recursively. 
            // (2) For differencing of order n, the first n values in the array that are not missing are set to zero in the packed array. These dummy values are not used in unpacking. 
            // (3) See data template 7.3 and associated notes for complementary information.
        ],
        // Grid point data - IEEE Floating Point Data
        '5.4': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-4.shtml
            {
                startIndex: 12,
                size: 1,
                content: null,
                table: '5.7',
                type: 'uint8',
                info: 'Precision (See code Table 5.7)'
            },
        ],
        // Grid point data - JPEG 2000 Code Stream Format
        '5.40': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-40.shtml
            {
                startIndex: 12,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Reference value (R) (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 16,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Binary scale factor (E)'
            },
            {
                startIndex: 18,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Decimal scale factor (D)'
            },
            {
                startIndex: 20,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits required to hold the resulting scaled and referenced data values. (i.e. The depth of the grayscale image.) (see Note 2)'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                table: '5.1',
                type: 'uint8',
                info: 'Type of original field values (see Code Table 5.1)'
            },
            {
                startIndex: 22,
                size: 1,
                content: null,
                table: '5.40',
                type: 'uint8',
                info: 'Type of Compression used. (see Code Table 5.40)'
            },
            {
                startIndex: 22,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Target compression ratio, M:1 (with respect to the bit-depth specified in octet 20), when octet 22 indicates Lossy Compression. Otherwise, set to missing (see Note 3)'
            }
            // Notes
            // (1) The intent of this template is to scale the grid point data to obtain desired precision, if appropriate, and then subtract out reference value from the scaled field as is done using Data Representation Template 5.0. After this, the resulting grid point field can be treated as a grayscale image and is then encoded into the JPEG 2000 code stream format. To unpack the data field, the JPEG 2000 code stream is decoded back into an image, and the original field is obtained from the image data as described in regulation 92.9.4, Note (4). 
            // (2) The JPEG 2000 standared specifies that the bit-depth must be in the range of 1 to 38 bits. 
            // (3) The compression ratio M:1 (e.g. 20:1) specifies that the encoded stream should be less than ((1/M) x depth x number of data points) bits, where depth is specified in octet 20 and number of data points is specified in octets 6-9 of the Data Representation Section. 
            // (4) The order of the data points should remain as specified in the scanning mode flags (Flag Table 3.4) set in the appropriate Grid Definition Template, even though the JPEG 2000 standard specifies that an image is stored starting at the top left corner. Assuming that the encoding software is expecting the image data in raster order (left to right across rows for each row), users should set the image width to Ni (or Nx) and the height to Nj (or Ny) if bit 3 of the scanning mode flag equals 0 (adjacent points in i (x) order), when encoding the "image." If bit 3 of the scanning mode flags equals 1 (adjacent points in j (y) order), it may be advantageous to set the image width to Nj (or Ny) and the height to Ni (or Nx). 
            // (5) This template should not be used when the data points are not available on a rectangular grid, such as occurs if some data points are bit-mapped out or if section 3 describes a quasi-regular grid. If it is necessary to use this template on such a grid, the data field can be treated as a one dimensional image where the height is set to 1 and the width is set to the total number of data points specified in octets 6-9. 
            // (6) Negative values of E or D shall be represented according to Regulation 92.1.5.
        ],
        // Grid point data - Portable Network Graphics (PNG) Format
        '5.41': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-41.shtml
            {
                startIndex: 12,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Reference value (R) (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 16,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Binary scale factor (E)'
            },
            {
                startIndex: 18,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Decimal scale factor (D)'
            },
            {
                startIndex: 20,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits required to hold the resulting scaled and referenced data values. (i.e. The depth of the grayscale image.) (see Note 2)'
            },
            {
                startIndex: 21,
                size: 1,
                content: null,
                table: '5.1',
                type: 'uint8',
                info: 'Type of original field values (see Code Table 5.1)'
            }
            // Notes
            // (1) The intent of this template is to scale the grid point data to obtain desired precision, if appropriate, and then subtract out reference value from the scaled field as is done using Data Representation Template 5.0. After this, the resulting grid point field can be treated as an image and is then encoded into the PNG format. To unpack the data field, the PNG stream is decoded back into an image, and the original field is obtained from the image data as described in regulation 92.9.4, Note (4). 
            // (2) PNG does not support all bit-depths in an image, so it is necessary to define which depths can be used and how they are to be treated. For grayscale images, PNG supports depths of 1, 2, 4, 8 or 16 bits. Red-Green-Blue (RGB) color images can have depths of 8 or 16 bits with an optional alpha sample. Valid values for octet 20 can be: 1, 2, 4, 8, or 16 - treat as a grayscale image 24 - treat as RGB color image (each component having 8 bit depth) 32 - treat as RGB w/alpha sample color image (each component having 8 bit depth) 
            // (3) The order of the data points should remain as specified in the scanning mode flags (Flag Table 3.4) set in the appropriate Grid Definition Template, even though the PNG standard specifies that an image is stored starting at the top left corner and scans across each row from left to right starting with the top row. Users should set the image width to Ni (or Nx) and the height to Nj (or Ny) if bit 3 of the scanning mode flag equals 0 (adjacent points in i (x) order), when encoding the "image." If bit 3 of the scanning mode flags equals 1 (adjacent points in j (y) order), it may be advantageous to set the image width to Nj (or Ny) and the height to Ni (or Nx). 
            // (4) This template should not be used when the data points are not available on a rectangular grid, such as occurs if some data points are bit-mapped out or if section 3 describes a quasi-regular grid. If it is necessary to use this template on such a grid, the data field can be treated as a one dimensional image where the height is set to 1 and the width is set to the total number of data points specified in octets 6-9. 
            // (5) Negative values of E or D shall be represented according to Regulation 92.1.5.
        ],
        // Spectral data - simple packing
        '5.50': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-50.shtml

        ],
        // Spherical harmonics data - complex packing
        '5.51': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-51.shtml

        ],
        // Grid point data - Simple packing with logarithm pre-processing
        '5.61': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-61.shtml
            {
                startIndex: 12,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Reference value (R) (IEEE 32-bit floating-point value)'
            },
            {
                startIndex: 16,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Binary scale factor (E)'
            },
            {
                startIndex: 18,
                size: 2,
                content: null,
                type: 'int16',
                info: 'Decimal scale factor (D)'
            },
            {
                startIndex: 20,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of bits used for each packed value'
            },
            {
                startIndex: 21,
                size: 4,
                content: null,
                type: 'float32',
                info: 'Pre-processing parameter (B) (IEEE 32-bit floating-point value)'
            }
            // Notes
            // (1) The template is approriately designed for data sets with all non-negative values and a wide variability range (more then 5 orders of magnitude). It must not be used for data sets with negative values or smaller variability range. 
            // (2) A logarithm pre-processing algorithm is used to fit the variability range into one or two order of magnitudes before using the simple packing algorithm. It requires a parameter (B) to assure that all values passed to the logarithm function are positive. Thus scaled values are Z=ln (Y+B), where Y are the original values, ln is the natural logarithm (or Napierian) function and B is chosen so that Y+B>0.
            // (3) Best pratice follows for choosing the B pre-processing parameter. (a) If the data set minimum value is positive, B can be safely put to zero. (b) If the data set minimum is zero, all values must be scaled to become greater than zero and B can be equal to the minimum positive value in the data set.
            // (4) Data shall be packed using Data template 7.
        ],
        // Grid point data - Run Length Packing With Level Values packing
        '5.200': [ // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_temp5-200.shtml
            {
                startIndex: 12,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Number of used for each packed value in the run length packing with level value'
            },
            {
                startIndex: 13,
                size: 2,
                content: null,
                type: 'uint16',
                info: 'MV - Maximum value within the levels that used in the packing'
            },
            {
                startIndex: 15,
                size: 2,
                content: null,
                type: 'uint16',
                info: 'MVL - Maximum value of level (Predefined)'
            },
            {
                startIndex: 17,
                size: 1,
                content: null,
                type: 'uint8',
                info: 'Decimal scale factor of representative value of each level'
            },
            {
                startIndex: 18,
                size: null, // from 18 to (19+2(lv-1))
                content: null,
                type: 'uint32',
                info: 'List of MVL scale representative values of each level from lv=1 to MVL'
            }
        ],
        

    }

    // TODO: Static code tables
    // Fill them here and complete in grib2utils when parsing data

    // Current data template
    constructor(buffer){

        this.buffer = buffer;

        this.sectionBuffers = [];

        this.dataTemplate = {
            // SECTION 0 - Indicator Section
            0: [ 
                {
                    startIndex: 1,
                    size: 4,
                    content: '',
                    type: 'String',
                    info: 'GRIB (Coded according to the International Alphabet Number 5)'
                },
                {
                    startIndex: 5,
                    size: 2,
                    content: null,
                    type: null,
                    info: 'Reserved'
                    
                },
                {
                    startIndex: 7,
                    size: 1,
                    content: 0, // Meteorological Products
                    type: 'uint8',
                    table: '0.0',
                    info: 'Discipline (From Table 0.0)' // 1 to 10; Discipline (From Table 0.0)
                    // Table 0.0
                    // 0 Meteorological Products, 1 Hydrological Products, 2 Land Surface Products, 
                    // 3 Satellite Remote Sensing Products, 4 Space Weather Products, 5-9 Reserved, 
                    // 10 Oceanographic Products, 11-191 Reserved, 192-254 Reserved for Local Use,
                    // 255 Missing
                },
                {
                    startIndex: 8,
                    size: 1,
                    content: 2,
                    type: 'uint8',
                    info: 'Edition number - 2 for GRIB2'
                },
                {
                    startIndex: 9,
                    size: 8, 
                    content: null,
                    type: 'uint64',
                    info: 'Total length of GRIB message in octects (All sections)'
                }
            ],
        
        
            // SECTION 1 - Identification Section
            // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect1.shtml
            1: [
                {
                    startIndex: 1,
                    size: 4,
                    content: 21, // 21 or N if Reserved is used
                    type: 'uint32',
                    info: 'Length of the section in octects (21 or N)'
                },
                {
                    startIndex: 5,
                    size: 1,
                    content: 1,
                    type: 'uint8',
                    info: 'Number of the section'
                },
                {
                    startIndex: 6,
                    size: 2,
                    content: 0,
                    type: 'uint16',
                    info: 'Identification of originating/generating center (See Table 0)'
                },
                {
                    startIndex: 8,
                    size: 2,
                    content: 0,
                    type: 'uint16',
                    info: 'Identification of originating/generating subcenter (See Table C)'
                },
                {
                    startIndex: 10,
                    size: 1,
                    content: 2,
                    type: 'uint8',
                    table: '1.0',
                    info: 'GRIB master tables version number (currently 2) (See Table 1.0)'
                },
                {
                    startIndex: 11,
                    size: 1,
                    content: 0, // 0 Local tables not used.
                    type: 'uint8',
                    table: '1.1',
                    info: 'Version number of GRIB local tables used to augment Master Tables (see Table 1.1)'
                    
                },
                {
                    startIndex: 12,
                    size: 1,
                    content: 2, // 2 Veryfing Time of Forecast
                    type: 'uint8',
                    table: '1.2',
                    info: 'Significance of reference time (See Table 1.2)'
                    // Table 1.2
                    // 0 Analysis, 1 Start of Forecast, 2 Veryfing Time of Forecast, 3 Observation Time, 3-191 Reserved,
                    // 192-254 Reserved for Local Use, 255 Missing
                },
                {
                    startIndex: 13,
                    size: 2,
                    content: 2021,
                    type: 'uint16',
                    info: 'Year (4 digits)'
                },
                {
                    startIndex: 15,
                    size: 1,
                    content: 8,
                    type: 'uint8',
                    info: 'Month'
                },
                {
                    startIndex: 16,
                    size: 1,
                    content: 30,
                    type: 'uint8',
                    info: 'Day'
                },
                {
                    startIndex: 17,
                    size: 1,
                    content: 12,
                    type: 'uint8',
                    info: 'Hour'
                },
                {
                    startIndex: 18,
                    size: 1,
                    content: 0,
                    type: 'uint8',
                    info: 'Minute'
                },
                {
                    startIndex: 19,
                    size: 1,
                    content: 0,
                    type: 'uint8',
                    info: 'Second'
                },
                {
                    startIndex: 20,
                    size: 1,
                    content: 0, // 0 Operational Products
                    type: 'uint8',
                    table: '1.3',
                    info: 'Production Status of Processed data in the GRIB message (See Table 1.3)'
                },
                {
                    startIndex: 21,
                    size: 1,
                    content: 1, // 1 Forecast Produts
                    type: 'uint8',
                    table: '1.4',
                    info: 'Type of processed data in this GRIB message (See Table 1.4)'
                },
                {
                    startIndex: 22,
                    size: 'end',
                    content: null,
                    type: null,
                    info: 'Reserved'
                },
            ],
        
        
        
            // SECTION 2 - Local Use Section
            // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect2.shtml
            2: [
                {
                    startIndex: 1,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Length of the section in octets (N)'
                },
                {
                    startIndex: 5,
                    size: 1,
                    content: 2,
                    type: 'uint8',
                    info: 'Number of the section (2)'
                },
                {
                    startIndex: 6,
                    size: 'end',
                    content: null,
                    type: null,
                    info: 'Local Use (6-N)'
                }
            ],
        
        
        
            // SECTION 3 - Grid Definition Section
            // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect3.shtml
            3: [
                {
                    startIndex: 1,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Length of the section in octets (nn)'
                },
                {
                    startIndex: 5,
                    size: 1,
                    content: 3,
                    type: 'uint8',
                    info: 'Number of the section'
                },
                {
                    startIndex: 6,
                    size: 1,
                    content: 1,
                    type: 'uint8',
                    table: '3.0',
                    info: 'Source of grid definition (See Table 3.0) (See note 1 below)'
                    // Table 3.0
                    // 0 Specified in Code Table 3.1, 1 Predetermined Grid Definition - Defined by Originating Center,
                    // 2-191 Reserved, 191-254 Reserved for Local Use, 255 A grid definition does not apply to this product
        
                    // Note 1: If octet 6 is not zero, octets 15-xx (15-nn if octet 11 is zero) may not be supplied.
                    // This should be documented with all bits set to 1 in the grid definition template number.
                },
                {
                    startIndex: 7,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Number of data points'
                },
                {
                    startIndex: 11,
                    size: 1,
                    content: 0,
                    type: 'uint8',
                    info: 'Number of octets for optional list of numbers defining number of points (See note 2 below)'
                    // Note 2: An optional list of numbers defining number of points is used to document a quasi-regular grid, 
                    // where the number of points may vary from one row to another.  In such a case, octet 11 is non zero and gives 
                    // the number octets on which each number of points is encoded.  For all other cases, such as regular grids, 
                    // octets 11 and 12 are zero and no list is appended to the grid definition template.
                },
                {
                    startIndex: 12,
                    size: 1,
                    content: null,
                    type: 'uint8',
                    table: '3.11',
                    info: 'Interpetation of list of numbers defining number of points (See Table 3.11)'
                },
                {
                    startIndex: 13,
                    size: 2,
                    content: null,
                    type: 'uint16',
                    table: '3.1',
                    info: 'Grid definition template number (= N) (See Table 3.1)'
                },
                {
                    startIndex: 15,
                    size: null, // 1-xx
                    content: null,
                    templateRef: {
                        section: 3,
                        index: 13,
                        info: 'Template 3.N, where N is the grid definition template number given in octets 13-14'
                    },
                    info: 'Grid definition template (See Template 3.N, where N is the grid definition template number given in octets 13-14)'
                },
                {
                    startIndex: null, // xx+1
                    size: 'end',
                    content: null,
                    info: 'Optional list of numbers defining number of points (See notes 2, 3, and 4 below)'
                    // 2.  An optional list of numbers defining number of points is used to document a quasi-regular grid, 
                    // where the number of points may vary from one row to another.  In such a case, octet 11 is non zero and 
                    // gives the number octets on which each number of points is encoded.  For all other cases, such as regular grids, 
                    // octets 11 and 12 are zero and no list is appended to the grid definition template.
                    // 3.  If a list of numbers defining the number of points is preset, it is appended at the end of the grid definition 
                    // template ( or directly after the grid definition number if the template is missing). When the grid definition template 
                    // is present, the length is given according to bit 3 of the scanning mode flag octet (length is Nj or Ny for flag value 0).
                    // List ordering is implied by data scanning.
                    // 4.  Depending on the code value given in octet 12, the list of numbers either:
                    //   - Corresponds to the coordinate lines as given in the grid definition, or
                    //   - Corresponds to a full circle, or
                    //   - Does not apply.
        
                }
            ],
        
        
        
            // SECTION 4 - Product Definition Section
            // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect4.shtml
            4: [
                {
                    startIndex: 1,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Length of the section in octets (nn)'
                },
                {
                    startIndex: 5,
                    size: 1,
                    content: 4,
                    type: 'uint8',
                    info: 'Number of the section (4)'
                },
                {
                    startIndex: 6,
                    size: 2,
                    content: null,
                    type: 'uint16',
                    info: 'Number of coordinate values after template (See note 1 below)'
                    // 1.  Coordinate values are intended to document the vertical discretization associated 
                    // with model data on hybrid coordinate vertical levels.  A value of zero in octets 6-7 indicates 
                    // that no such values are present.  Otherwise the number corresponds to the whole set of values.
                },
                {
                    startIndex: 8,
                    size: 2,
                    content: null,
                    table: '4.0',
                    type: 'uint16',
                    info: 'Product definition template number (See Table 4.0)'
                },
                {
                    startIndex: 10,
                    size: null,
                    content: null,
                    templateRef: {
                        section: 4,
                        index: 8,
                        info: 'Template 4.X, where X is the number given in octets 8-9)'
                    },
                    info: 'Product definition template (See product template 4.X, where X is the number given in octets 8-9)'
                },
                {
                    startIndex: 'nextAvailable', // [xx+1]-nn 
                    size: 'end',
                    content: null,
                    info: 'Optional list of coordinate values (See notes 2 and 3 below)'
                    // 2.  Hybrid systems employ a means of representing vertical coordinates in terms of a mathematical 
                    // combination of pressure and sigma coordinates.  When used in conjunction with a surface pressure field and 
                    // an appropriate mathematical expression, the vertical coordinate parameters may be used to interpret the 
                    // hybrid vertical coordinate.
                    // 3.  Hybrid coordinate values, if present, should be encoded in IEEE 32-bit floating point format. They are 
                    // intended to be encoded as pairs.
                }
            ],
        
        
        
            // SECTION 5 - Data Representation Section
            // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect5.shtml
            5: [
                {
                    startIndex: 1,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Length of the section in octets (nn)'
                },
                {
                    startIndex: 5,
                    size: 1,
                    content: 5,
                    type: 'uint8',
                    info: 'Number of the section (5)'
                },
                {
                    startIndex: 6,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Number of data points where one or more values are specified in Section 7 when a bit map is present, total number of data points when a bit map is absent.'
                },
                {
                    startIndex: 10,
                    size: 2,
                    content: 0, // 0 Grid Point Data - Simple Packing (see Template 5.0)
                    table: '5.0',
                    type: 'uint16',
                    info: 'Data representation template number (See Table 5.0)'
                },
                {
                    startIndex: 12,
                    size: null,
                    content: null,
                    templateRef: {
                        section: 5,
                        index: 10,
                        info: 'Template 5.X, where X is the number given in octets 10-11)'
                    },
                    info: 'Data representation template (See Template 5.X, where X is the number given in octets 10-11)'
                    // For example, Template Grid Point Data:
                    // 12-15	Reference value (R) (IEEE 32-bit floating-point value)
                    // 16-17	Binary scale factor (E)
                    // 18-19	Decimal scale factor (D)
                    // 20	    Number of bits used for each packed value for simple packing, or for each group reference value for complex packing or spatial differencing
                    // 21	    Type of original field values (see Code Table 5.1)
                    // Negative values of E or D shall be represented according to Regulation 92.1.5.
                },
                
            ],
        
        
        
            // SECTION 6 - Bit Map Section
            // https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect5.shtml
            6: [
                {
                    startIndex: 1,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Length of the section in octets (nn)'
                },
                {
                    startIndex: 5,
                    size: 1,
                    content: 6,
                    type: 'uint8',
                    info: 'Number of the section (6)' 
                },
                {
                    startIndex: 6,
                    size: 1,
                    content: null,
                    table: '6.0',
                    type: 'uint8',
                    info: 'Bit-map indicator (See Table 6.0) (See note 1 below)'
                    // 1.  If octet 6 is not zero, the length of this section is 6 and octets 7-nn are not present.
        
                    // 0        A bit map applies to this product and is specified in this section.
                    // 1-253    A bit map pre-determined by the orginating/generating center applies to this product and is not specified in this section.
                    // 254      A bit map previously defined in the same GRIB2 message applies to this product.
                    // 255      A bit map does not apply to this product.
                },
                {
                    startIndex: 7,
                    size: 'end',
                    content: null,
                    info: 'Bit-map'
                },
                
            ],
        
        
        
            // SECTION 7 - Data Selection
            7: [
                {
                    startIndex: 1,
                    size: 4,
                    content: null,
                    type: 'uint32',
                    info: 'Length of the section in octets (nn)',
                },
                {
                    startIndex: 5,
                    size: 1,
                    content: 7,
                    type: 'uint8',
                    info: 'Number of the section (7)',
                },
                {
                    startIndex: 6,
                    size: 'end',
                    content: null, // Data
                    info: 'Data in a format described by data Template 7.X, where X is the data representation template number given in octets 10-11 of Section 5.',
                },
            ],



            // SECTION 8 - End section
            8: [
                {
                    startIndex: 1,
                    size: 4,
                    content: '',
                    type: 'String',
                    info: '"7777" - Coded according to the International Alphabet Number 5.'
                }
            ]
        
        }


        
    }
}

/*
var el = document.getElementsByTagName('tbody')[0]
var empty = {};
for (var i = 1; i< el.children.length; i++){
    if (el.children[i].children.length != 0){
        var key = el.children[i].children[0].innerText;
        key = key.replace('\n', '');
        var text = el.children[i].children[1].innerText.replace('\n', '');
        empty[key] = text
    }
}
empty

var jsonArray = [];
var keys = Object.keys(empty);
keys.sort((a, b) => a.split("-")[0] - b.split("-")[0])
for (var i = 0; i < keys.length; i++){
    var json = {};
    var index = keys[i];
    json.info = empty[index];
    json.startIndex = 1*index.split("-")[0];

    // Table ref
    if (json.info.includes("Table")){
        var tableNum = json.info.split("Table ")[1].split(")")[0];
        json.table = tableNum;
    }

    json.size = 1;
    json.type = 'uint8';
    // More than one number here
    if (index.split("-").length > 1){
        json.size = index.split("-")[1] - json.startIndex + 1;
        if (json.size == 2)
            json.type = 'uint16';
        else if (json.size == 3)
            console.log("size 3")
        else if (json.size == 4)
            json.type = 'uint32';
    }
    json.content = null;


    jsonArray[i]= json;
}
console.log(JSON.stringify(jsonArray))

*/