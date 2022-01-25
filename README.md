# GRIB2 decoder in the browser
This respository contains a decoder of GRIB2 files in javascript. You can try with your own GRIB2 files in [https://bluenetcat.github.io/grib22json](https://bluenetcat.github.io/grib22json/). The GRIB2 format was created by the World Meteorological Organization (WMO) and it is an [accepted standard](http://docs.opengeospatial.org/is/16-060r2/16-060r2.html) of the Open Geospatial Consortium (OGC).

## Introduction
As far as the author knows, most web applications decode the GRIB2 files in the server and then send them to the client. For example the application from Cameron Beccario ([https://earth.nullschool.net/](https://earth.nullschool.net/)) decodes the GRIB2 to JSON on the server (Java-app) and then formats it in his own propietary binary format to reduce the file size for transmission to the client. You can find the GRIB2json server side code here: [https://github.com/cambecc/grib2json](https://github.com/cambecc/grib2json).

The advantage of decoding the GRIB2 file in the client is that it reduces the server-client transmission time (GRIB2 compresses data efficiently) and it reduces the complexity of the server (server only needs to download/store the GRIB2 from NOAA and send it to the client). Nevertheless, decoding time in the client might be an issue when GRIB2 files are large.

This decoder is in development and does not support all the features of GRIB2. It supports the decoding of GFS from NOAA, which covers a lot of forecasting variables accross the globe. According to windy.com, the dataset from NOAA is: "*Basic free model provided by National Oceanic and Atmospheric Administration (NOAA) with not so good resolution. Compared to other models GFS can fail in mountain areas, and by forecasting clouds and precipitation. Since the model is free, majority of weather applications use GFS.*"

To download GFS files manually, I use the [grib filter](https://nomads.ncep.noaa.gov/cgi-bin/filter_gdas_0p25.pl?dir=%2Fgdas.20220120%2F12%2Fatmos) interface and the [information about the layers](https://nomads.ncep.noaa.gov/dods/gdas_0p25/gdas20220120/gdas_0p25_06z.info). You can access both from [https://nomads.ncep.noaa.gov/](https://nomads.ncep.noaa.gov/). A useful tutorial can be found in [youtube by David Burch](https://www.youtube.com/watch?v=P2An8iwzv5E&ab_channel=DavidBurch). In the grib filter you have to specify the level and the variable. Because most variables are only at one specific level, sometimes it is difficult to know at what level the variable is. For that, I use the information about the layers. You can infer the level you have to choose from there. For example wind speed is coded as UGRID and VGRID in the grib filter variables and the wind speed is found at the level 10 meters above ground. In the [information website](https://nomads.ncep.noaa.gov/dods/gdas_0p25/gdas20220120/gdas_0p25_06z.info), you can find the wind variable name and the level (ugrd10m - 10 m above ground u-component of wind [m/s]).

## Development links
I used the GRIB2 information from NOAA ([https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/)) and ECMWF ([https://apps.ecmwf.int/codes/grib/format/grib2/](https://apps.ecmwf.int/codes/grib/format/grib2/)). The GRIB2 format was developed by the World Meteorological Organization (WMO), but the links on their website are rather hard to find or lost. The full description of GRIB2 from WMO can be found in this [link](https://library.wmo.int/doc_num.php?explnum_id=10722).

## Current status of GRIB2 decoder
- [SECTION 0 - Indicator Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect0.shtml)
   - Discipline not implemented. Requires lots of tables. Only time is decoded.
- [SECTION 1 - Identification Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect1.shtml)
   - Originating center not implemented. Requires lots of tables.
- [SECTION 2 - Local Use Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect2.shtml)
   - Not implemented.
- [SECTION 3 - Grid Definition Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect3.shtml)
   - Basic grids are decoded. Some grid definition templates are missing. 
- [SECTION 4 - Product Definition Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect4.shtml)
   - Not implemented. Requires lots of tables that depend on the product discipline.
- [SECTION 5 - Data Representation Template](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect5.shtml)
   - Implemented for 5.0 Simple packing, 5.3 Complex Packing and Spatial Differencing, 5.4 IEEE Floating Point Data. 5.2 Complex packing should be straight forward to implement. PNG and JPEG might be easy to decode with 
- [SECTION 6 - Bit-map Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect6.shtml)
   - Implemented when the bitmap applies to this product and is specified in this section.
- [SECTION 7 - Data Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect7.shtml)
   - Implemented for 5.0 Simple packing, 5.3 Complex Packing and Spatial Differencing, 5.4 IEEE Floating Point Data.
- [SECTION 8 - Local Use Section](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect8.shtml) &#9989;
