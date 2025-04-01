/****

  cvm_region.js

****/

var CVM_tb={
"models": [
{'id':1,
     'name':'ALBACORE',
     'abb name':'albacore',
     'path name':'albacore',
     'model filename':'albacore.tar.gz',
     'description':'Southern California Off-shore Velocity Model',
     'detail':'Depth:0 to 100km',
     'coordinates': [ {'lon':-116.847200,'lat':33.300000},
                      {'lon':-116.847200,'lat':32.700000},
                      {'lon':-124.047200,'lat':32.700000},
                      {'lon':-124.047200,'lat':33.000000},
                      {'lon':-124.647200,'lat':33.000000},
                      {'lon':-124.647200,'lat':33.600000},
                      {'lon':-123.447200,'lat':33.600000},
                      {'lon':-123.447200,'lat':33.900000},
                      {'lon':-123.147200,'lat':33.900000},
                      {'lon':-123.147200,'lat':34.200000},
                      {'lon':-121.347200,'lat':34.200000},
                      {'lon':-121.347200,'lat':34.500000},
                      {'lon':-120.447200,'lat':34.500000},
                      {'lon':-120.447200,'lat':34.800000},
                      {'lon':-118.947200,'lat':34.800000},
                      {'lon':-118.947200,'lat':34.500000},
                      {'lon':-118.647200,'lat':34.500000},
                      {'lon':-118.647200,'lat':34.200000},
                      {'lon':-118.047200,'lat':34.200000},
                      {'lon':-118.047200,'lat':33.900000},
                      {'lon':-117.447200,'lat':33.900000},
                      {'lon':-117.447200,'lat':33.600000},
                      {'lon':-117.147200,'lat':33.600000},
                      {'lon':-117.147200,'lat':33.300000} ],
     'color':'#0000FF'},
{'id':2,
     'name':'CANVAS',
     'abb name':'canvas',
     'path name':'canvas',
     'model filename':'canvas.tar.gz',
     'description':'CANVAS describes radially anisotropic P- and S-wave speeds for California and Nevada based on publicly available broadband data. CANVAS was determined by optimizing the fit between observed and synthetic data for moderate-magnitude (Mw 4.5-6.5) earthquakes that occurred within its domain. CANVAS effectively predicts waveform fits down to minimum periods of 12 seconds.',
     'description_brief':'CANVAS describes radially anisotropic P- and S-wave speeds for California and Nevada based on publicly available broadband data. CANVAS was determined by optimizing the fit between observed and synthetic data for moderate-magnitude (Mw 4.5-6.5) earthquakes ...',
     'coordinates': [ {'lon':-114.0,'lat':31.5},
                      {'lon':-125.0,'lat':31.5},
                      {'lon':-125.0,'lat':43.0},
                      {'lon':-114.0,'lat':43.0} ],
     'color':'#FF0F0F'},
{'id':3,
     'name':'CCA',
     'abb name':'cca',
     'path name':'cca',
     'model filename':'cca.tar.gz',
     'description':'Central California Area Velocity Model at iteration 6 with an optional Ely-Jordan GTL',
     'coordinates': [ { 'lon': -122.950, 'lat': 36.598 },
                      { 'lon':-118.296, 'lat':39.353 },
                      { 'lon':-115.445, 'lat':36.038 },
                      { 'lon':-120.000, 'lat':33.398 } ],
     'color':'#0000FF'},
{'id':4,
     'name':'CenCalVM',
     'abb name':'cencal',
     'path name':'cencal',
     'model filename':'cencal.tar.gz',
     'description':'USGS Bay Area (CenCal) Velocity Model',
     'detail':'USGS developed San Francisco and Central California velocity model',
     'coordinates': [ {'lon':-120.644051,'lat':37.050062},
                      {'lon':-121.922036,'lat':36.320331},
                      {'lon':-123.858493,'lat':38.424179},
                      {'lon':-122.562365,'lat':39.174505}, 
                      {'lon':-120.644051,'lat':37.050062} ],
     'color':'#FF00FF'},
{'id':5,
     'name':'CS173',
     'abb name':'cs173',
     'path name':'cs173',
     'model filename':'cs173.tar.gz',
     'description':'CyberShake Study 17.3 Central California Velocity Model with an optional Ely-Jordan GTL',
     'coordinates': [ { 'lon':-127.65648, 'lat':37.08416 },
                      { 'lon':-116.48562, 'lat':31.26643 },
                      { 'lon':-112.92896, 'lat':35.33518 },
                      { 'lon':-124.51032, 'lat':41.45284 } ],
     'color':'#00FFFF'},
{'id':6,
     'name':'CS173h',
     'abb name':'cs173h',
     'path name':'cs173h',
     'model filename':'cs173h.tar.gz',
     'description':'CyberShake Study 17.3 Central California Velocity Model integrated with Harvard group\'s Santa Maria and San Joaquin Basin Models with an optional Ely-Jordan GTL',
     'coordinates': [ { 'lon':-127.65648, 'lat':37.08416 },
                      { 'lon':-116.48562, 'lat':31.26643 },
                      { 'lon':-112.92896, 'lat':35.33518 },
                      { 'lon':-124.51032, 'lat':41.45284 } ],
     'color':'#7FFFD4'},
{'id':7,
     'name':'CS 248',
     'abb name':'cs248',
     'path name':'cs248',
     'model filename':'cs248.tar.gz',
     'description':'CS248 is the velocity model used for CyberShake Study 24.8 in Northern California. It was constructed by tiling together the USGS SFCVM v21.1, CCA-06, and a 1D velocity model derived from the Sierra region of the SFCVM. The Nakata/Pitarka correction was applied to the gabbro.  The minimum Vs was 400 m/s, interfaces were smoothed at a distance of 20km, an Ely-Jordan taper was applied to the top 700m, the Vp/Vs ratio was capped at 4, and the surface point was populated at a depth of 20m.',
     'description_brief':'CS248 is the velocity model used for CyberShake Study 24.8 in Northern California. It was constructed by tiling together the USGS SFCVM v21.1, CCA-06, and a 1D velocity model derived from the Sierra region of the SFCVM. The Nakata/Pitarka correction was applied to the gabbro. The minimum Vs was 400 m/s, ...',
     'coordinates': [ {'lon':-126.18649,'lat':39.750630},
                      {'lon':-121.852810,'lat':42.277910},
                      {'lon':-116.723950,'lat':36.561620},
                      {'lon':-120.902940,'lat':34.222430} ],
     'color':'#663399'},
{'id':8,
     'name':'CVM-H Inner Borderland Basin',
     'abb name':'cvmhibbn',
     'path name':'cvmhibbn',
     'model filename':'cvmhibbn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-119.408382,'lat':32.209382},
                      {'lon':-119.408382,'lat':34.063373},
                      {'lon':-117.162546,'lat':34.063373},
                      {'lon':-117.162546,'lat':32.209382} ],
     'color':'#4B0082'},
{'id':9,
     'name':'CVM-H LA Basin',
     'abb name':'cvmhlabn',
     'path name':'cvmhlabn',
     'model filename':'cvmhlabn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',

     'coordinates': [ {'lon':-118.60524,'lat':32.978073},
                      {'lon':-117.256881,'lat':32.988127},
                      {'lon':-117.260267,'lat':34.123581},
                      {'lon':-118.62639,'lat':34.114087} ],
     'color':'#4B0082'},
{'id':10,
     'name':'CVM-H Ridge Basin',
     'abb name':'cvmhrbn',
     'path name':'cvmhrbn',
     'model filename':'cvmhrbn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-118.881062,'lat':34.355666},
                      {'lon':-118.881062,'lat':34.877650},
                      {'lon':-118.258317,'lat':34.877650},
                      {'lon':-118.258317,'lat':34.355666} ],
     'color':'#4B0082'},
{'id':11,
     'name':'CVM-H Salton Trough Basin',
     'abb name':'cvmhstbn',
     'path name':'cvmhstbn',
     'model filename':'cvmhstbn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-116.442177,'lat':31.455197},
                      {'lon':-116.442177,'lat':33.796263},
                      {'lon':-113.792254,'lat':33.796263},
                      {'lon':-113.792254,'lat':31.455197} ],
     'color':'#4B0082'},
{'id':12,
     'name':'CVM-H San Bernardino Basin',
     'abb name':'cvmhsbbn',
     'path name':'cvmhsbbn',
     'model filename':'cvmhsbbn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-117.357373,'lat':34.008847},
                      {'lon':-117.357373,'lat':34.153590},
                      {'lon':-117.141023,'lat':34.153590},
                      {'lon':-117.141023,'lat':34.008847} ],
     'color':'#4B0082'},
{'id':13,
     'name':'CVM-H San Gabriel Basin',
     'abb name':'cvmhsgbn',
     'path name':'cvmhsgbn',
     'model filename':'cvmhsgbn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-118.26439,'lat':33.82977},
                      {'lon':-118.26439,'lat':34.19044},
                      {'lon':-117.33646,'lat':34.19654},
                      {'lon':-117.33504,'lat':33.83579} ],
     'color':'#4B0082'},
{'id':14,
     'name':'CVM-H Santa Barbara Channel Basin',
     'abb name':'cvmhsbcbn',
     'path name':'cvmhsbcbn',
     'model filename':'cvmhsbcbn.tar.gz', 
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-120.980982,'lat':33.710630},
                      {'lon':-120.980982,'lat':34.649084},
                      {'lon':-119.596757,'lat':34.649084},
                      {'lon':-119.596757,'lat':33.710630} ],
     'color':'#4B0082'},
{'id':15,
     'name':'CVM-H Santa Maria Basin',
     'abb name':'cvmhsmbn',
     'path name':'cvmhsmbn',
     'model filename':'cvmhsmbn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-121.016139,'lat':34.457383},
                      {'lon':-121.016139,'lat':35.468350},
                      {'lon':-119.644879,'lat':35.468350},
                      {'lon':-119.644879,'lat':34.457383} ],
     'color':'#4B0082'},
{'id':16,
     'name':'CVM-H v15.1.1',
     'abb name':'cvmh',
     'path name':'cvmh',
     'model filename':'cvmh.tar.gz',
     'description':'The SCEC CVM-H velocity model describes seismic P- and S-wave velocities and densities, and is comprised of basin structures embedded in tomographic and teleseismic crust and upper mantle models. This latest release of the CVM-H (15.1.1) represents the integration of various model components, including fully 3D waveform tomographic results.',
     'coordinates': [ {'lon':-120.862028,'lat':30.956496},
                      {'lon':-120.862028,'lat':36.612951},
                      {'lon':-113.33294,'lat':36.612951},
                      {'lon':-113.33294,'lat':30.956496} ],
     'color':'#00B0FF'},
{'id':17,
     'name':'CVM-H Ventura Basin',
     'abb name':'cvmhvbn',
     'path name':'cvmhvbn',
     'model filename':'cvmhvbn.tar.gz',
     'description':'The CVM-H basin models describe seismic P- and S-wave velocities, and densities in sedimentary basins, based on sonic logs in wells, stacking velocities in seismic reflection surveys, and calibrated age-depth relationships in some basins. The base of models is the top of crystalline or metamorphic rocks below the basins.',
     'coordinates': [ {'lon':-119.56521,'lat':33.97183},
                      {'lon':-119.56521,'lat':34.52582},
                      {'lon':-118.08960,'lat':34.52582},
                      {'lon':-118.08960,'lat':33.97183} ],
     'color':'#4B0082'},
{'id':18,
     'name':'CVM-S4',
     'abb name':'cvms',
     'path name':'cvms',
     'model filename':'cvms.tar.gz',
     'description':'Southern California Velocity Model developed by SCEC, Caltech, USGS Group with geotechnical layer',
     'coordinates': [ {'lon':-116.64433,'lat':31.102},
                      {'lon':-121.568,'lat':35.18167},
                      {'lon':-118.49184,'lat':37.73133},
                      {'lon':-113.56834,'lat':33.65166} ],
     'color':'#FF3D00'},
{'id':19,
     'name':'CVM-S4.26',
     'abb name':'cvms5',
     'path name':'cvms5',
     'model filename':'cvms5.tar.gz',
     'description':'Tomography improved version of CVM-S4 with no geotechnical layer but has an optional Ely-Jordan GTL',
     'coordinates': [ {'lon':-116.000,'lat':30.4499},
                      {'lon':-122.300,'lat':34.7835},
                      {'lon':-118.9475,'lat':38.3035},
                      {'lon':-112.5182,'lat':33.7819} ],
     'color':'#2E7D32'},
{'id':20,
     'name':'CVM-S4.26.M01',
     'abb name':'cvmsi',
     'path name':'cvmsi',
     'model filename':'cvmsi.tar.gz',
     'description':'CVM-S4.26 with geotechnical layer',
     'coordinates': [ {'lon':-116.000,'lat':30.4499}, 
                      {'lon':-122.300,'lat':34.7835}, 
                      {'lon':-118.9475,'lat':38.3035},
                      {'lon':-112.5182,'lat':33.7819} ],
     'color':'#FFA726'},
{'id':21,
     'name':'San Francisco Bay Velocity Model',
     'abb name':'sfcvm',
     'path name':'sfcvm',
     'model filename':'sfcvm.tar.gz',
     'description':'USGS San Francisco Bay Region 3D Velocity Model',
     'detail':'Geology-based model with a non-uniform spacing',
     'coordinates': [ {'lon':-121.9309,'lat':35.0364},
                       {'lon':-118.9787,'lat':36.7104},
                       {'lon':-123.2775,'lat':41.4586},
                       {'lon':-126.3216,'lat':39.6755},
                       {'lon':-121.9309,'lat':35.0364} ],
     'color':'#FF00FF'},
{'id':22,
     'name':'San Jacinto Fault Zone',
     'abb name':'sjfz',
     'path name':'sjfz',
     'model filename':'sjfz.tar.gz',
     'description':'San Jacinto Fault Zone',
     'coordinates': [ {'lon':-115.38,'lat':32.38},
                      {'lon':-118.17,'lat':32.38},
                      {'lon':-118.17,'lat':34.54},
                      {'lon':-115.38,'lat':34.54} ],
     'color':'#00CC00'},
{'id':23,
     'name':'SSIP Coachella Valley',
     'abb name':'cvlsu',
     'path name':'cvlsu',
     'model filename':'cvlsu.tar.gz',
     'description':'The SSIP Coachella Valley model provides P-wave velocities for the shallow crust in the northern Salton Trough. The model combines travel-time observations from explosions recorded during the Salton Seismic Imaging Project (SSIP) with local earthquake recordings. The model extends from the surface to 9-km depth.',
     'detail':'Depth:-5km to 16km',
     'coordinates': [ {'lon':-115.7,'lat':33.3},
                      {'lon':-116.7,'lat':33.3},
                      {'lon':-116.7,'lat':34.2},
                      {'lon':-115.7,'lat':34.2} ],
     'color':'#FF3C00'},
{'id':24,
     'name':'SSIP Imperial Valley',
     'abb name':'ivlsu',
     'path name':'ivlsu',
     'model filename':'ivlsu.tar.gz',
     'description':'The SSIP Imperial Valley model provides P-wave velocities for the shallow crust in the southern Salton Trough, from the southern Salton Sea to the USA-Mexico border. The model combines travel-time observations from explosions recorded during the Salton Seismic Imaging Project (SSIP) and the IV1979 active source experiment with local earthquake recordings. The model extends from the surface to 8-km depth.',
     'description_brief':'The SSIP Imperial Valley model provides P-wave velocities for the shallow crust in the southern Salton Trough, from the southern Salton Sea to the USA-Mexico border. The model combines travel-time observations from explosions recorded during the Salton Seismic Imaging Project (SSIP) ...',
     'coordinates': [ {'lon':-116.051578,'lat':32.596922},
                      {'lon':-115.344866,'lat':32.596922},
                      {'lon':-115.344866,'lat':33.356203},
                      {'lon':-116.051578,'lat':33.356203} ],
     'color':'#220082'},
{'id':25,
     'name':'UW Lin Thurber',
     'abb name':'uwlinca',
     'path name':'uwlinca',
     'model filename':'uwlinca.tar.gz',
     'description':'The UW statewide model is a three-dimensional (3D) tomographic model of the P wave velocity (Vp) structure of northern California. It was obtained using a regional-scale double-difference tomography algorithm that incorporates a finite-difference travel time calculator and spatial smoothing constraints. Arrival times from earthquakes and travel times from controlled-source explosions, recorded at network and/or temporary stations, were inverted for Vp on a 3D grid with horizontal node spacing of 10 to 20 km and vertical node spacing of 3 to 8.',
     'description_brief':'The UW statewide model is a three-dimensional (3D) tomographic model of the P wave velocity (Vp) structure of northern California. It was obtained using a regional-scale double-difference tomography algorithm that incorporates a finite-difference travel time calculator and ...',
     'coordinates': [ {'lon':-126.9210,'lat':39.8816},
                      {'lon':-121.4117,'lat':43.0597},
                      {'lon':-112.8281,'lat':33.4362},
                      {'lon':-118.1781,'lat':30.2581} ],    
     'color':'#0F0F0F'},
{'id':26,
     'name':'UW San Francisco Bay',
     'abb name':'uwsfbcvm',
     'path name':'uwsfbcvm',
     'model filename':'uwsfbcvm.tar.gz',
     'description':'The uwsfbcvm velocity model describes 3D seismic P- and S-wave velocities from a tomographic inversion for crustal structure in the San Francisco Bay region. The inversion used a modified version of the code by Fang et al. (JGR, 2016), which inverts both body-wave arrival times and surface-wave dispersion measurements for 3D P- and S-wave velocity structure simultaneously with determining earthquake locations.',
     'description_brief':'The uwsfbcvm velocity model describes 3D seismic P- and S-wave velocities from a tomographic inversion for crustal structure in the San Francisco Bay region. The inversion used a modified version of the code by Fang et al. (JGR, 2016), which inverts both body-wave arrival times and ...',
     'coordinates': [ {'lon':-124.0,'lat':35.8},
                      {'lon':-120.0,'lat':35.8},
                      {'lon':-120.0,'lat':39.40},
                      {'lon':-124.0,'lat':39.40} ],
     'color':'#220082'},
{'id':27,
     'name':'Wasatch Front Utah',
     'abb name':'wfcvm',
     'path name':'wfcvm',
     'model filename':'wfcvm.tar.gz',
     'map':'ucvm_utah',
     'description':'Wasatch Front Community Velocity Model (UTAH)',
     'coordinates': [ {'lon':-112.699997,'lat':39.75},
                      {'lon':-112.699997,'lat':42},
                      {'lon':-111.5,'lat':42},
                      {'lon':-111.5,'lat':39.75} ],
     'color':'#FF3CFF'},
    ],
"maps": [
    {'id':1,
     'map name':'UCVM',
     'abb name':'ucvm',
     'path name':'ucvm',
     'map filename':'ucvm.e',
     'description':'UCVM Topography and Vs30 Coverage Region(Thompson 2022)',
     'coordinates': [
        {'lon':-129.25,'lat':41},
        {'lon':-117.4199,'lat':28.0268},
        {'lon':-110.3864,'lat':31.80259},
        {'lon':-121.5606,'lat':45.4670}
               ],
     'color':'#FF0000'},
    {'id':2,
     'map name':'UCVM UTAH',
     'abb name':'ucvm_utah',
     'path name':'ucvm_utah',
     'map filename':'ucvm_utah.e',
     'description':'UCVM Utah Topography and Vs30 Coverage Region(2006)',
     'coordinates': [
        {'lon':-116,'lat':35},
        {'lon':-116,'lat':44},
        {'lon':-108,'lat':44},
        {'lon':-108,'lat':35}
               ],
     'color':'#FF00FF'}
    ],
"fileformats": [
    {'id':1,
     'format name':'image',
     'suffix':'png',
     'description':'plot image in fixed discrete color scale'},
    {'id':2,
     'format name':'metadata',
     'suffix':'json',
     'description':'metadata describing the image and the binary image data'},
    {'id':3,
     'format name':'data',
     'suffix':'bin',
     'description':'binary image data'},
    {'id':4,
     'format name':'dataset',
     'suffix':'json',
     'description':'image data in triplets'},
    {'id':5,
     'format name':'material property data',
     'suffix':'json',
     'description':'material property'}
    ],
"zmodes": [
    {'id':1,
     'mode name':'Depth',
     'value':'d',
     'description':'0 at surface and positive depth value'},
    {'id':2,
     'mode name':'Elevation(km)',
     'value':'e',
     'description':'0 at sealevel and positive value toward the air and negative value toward the center of the earth'}
    ],
"Products": [
    {'id': 1,
     'product name': '0D Point',
     'description':'Material Properties are returned for the selected location'},
    {'id': 2,
     'product name': '1D Vertical Profile',
     'description':'3 Vertical profile(Vp, Vs, Rho) plots are produced for the selected location. The plot starts at Z start, ends at Z ends, and in Z step interval'},
    {'id': 3,
     'product name': '2D Vertical Cross Section',
     'description':'A Cross section of a selected property is produced between two selected points. The plot starts at Z start, ends at Z ends, and the interval is determined by the web service'},
    {'id': 3,
     'product name': '2D Horizontal Slice',
     'description':'A Horizontal slice of a selected property is produced in a area marked by the rectangle drawn with the depth or elevation supplied as Z, and the interval is determined by the web service.'}
 ],
"descript": [
    {'id':'lon','label':'lon','show':1,'descript':'Longitude'},
    {'id':'lat','label':'lat','show':1,'descript':'Latitude'},
    {'id':'Z','label':'Z','show':1,'descript':'Input Z<br>(elevation - meters above sea level. Positive numbers above sea-level)<br>(depth - meters below ground surface. Positive numbers below ground surface)'},
    {'id':'surf','label':'surf','show':1,'descript':'Surface elevation from sea level'},
    {'id':'vs30','label':'vs30','show':1,'descript':'vs30 value from Thompson 2022 map'},
    {'id':'crustal','label':'crustal','show':1,'descript':'crustal model'},
    {'id':'cr_vp','label':'cr_vp','show':0,'descript':'cr_vp'},
    {'id':'cr_vs','label':'cr_vs','show':0,'descript':'cr_vs'},
    {'id':'cr_rho','label':'cr_rho','show':0,'descript':'cr_rho'},
    {'id':'gtl','label':'gtl','show':1,'descript':'gtl'},
    {'id':'gtl_vp','label':'gtl_vp','show':0,'descript':'gtl_vp'},
    {'id':'gtl_vs','label':'gtl_vs','show':0,'descript':'gtl_vs'},
    {'id':'gtl_rho','label':'gtl_rho','show':0,'descript':'gtl_rho'},
    {'id':'cmb_algo','label':'cmb_algo','show':0,'descript':'cmb_algo'},
    {'id':'cmb_vp','label':'vp','show':1,'descript':'vp'},
    {'id':'cmb_vs','label':'vs','show':1,'descript':'vs'},
    {'id':'cmb_rho','label':'rho','show':1,'descript':'rho'},
    {'id':'Zmode','label':'zmode','show':0,'descript':'zmode'},
 ],
"1D model": [
    {'id': 1,
     'name':'1D',
     'abb name':'1d',
     'description': 'Southern California regional 1D model based on Hadley-Kanamori Model',
    },
    {'id': 2,
     'name':'BBP1D',
     'abb name': 'bbp1d',
     'description': 'Nortridge Region 1D Los Angeles Basin model used in SCEC Broadband Platform'
    },
    {'id': 3,
     'name':'SF1D',
     'abb name':'sf1d',
     'description': 'SFCVM Sierra Foothills 1D Velocity Model'
    },
],
"interpolator": [
    {'id': 1,
     'name': 'elygtl:ely',
     'abb name': 'elygtl:ely',
     'description': 'elygtl:ely...',
    },
    {'id': 2,
     'name': 'elygtl:taper',
     'abb name': 'elygtl:taper',
     'description': 'elygtl:taper..'
    },
],
"references": [
{ 'type':'model','name': ['albacore'],
     'author': 'Bowden et al., (2016)',
     'ref': 'Bowden, D. C., Kohler, M. D., Tsai, V. C., & Weeraratne, D. S. (2016). Offshore southern California lithospheric velocity structure from noise cross-correlation functions. Journal of Geophysical Research, 121(5), 3415-3427. doi:10.1002/2016JB012919'
},
{ 'type':'model','name':['canvas'],
     'author':'Doody et al., (2023)',
     'ref':'Doody, C., Rodgers, A., Afanasiev, M., Boehm, C., Krischer, L., Chiang, A., & Simmons, N. (2023). CANVAS: An adjoint waveform tomography model of California and Nevada. Journal of Geophysical Research: Solid Earth, 128(12). https://doi.org/10.1029/2023JB027583'
},
{ 'type':'model','name':['canvas'],
     'author':'Doody (2023)',
     'ref':'Doody, C. (2023). Dataset for `CANVAS: An adjoint waveform tomography model of California and Nevada` [Data set]. In Journal of Geophysical Research: Solid Earth (Vol. 128, Number 12). Zenodo. https://doi.org/10.5281/zenodo.8415562'
},
{ 'type':'model','name':['cca'] },
{ 'type':'model','name':['cencal'] },
{ 'type':'model','name':['cs173'] },
{ 'type':'model','name':['cs173h'] },
{ 'type':'model','name':['cs248'] },
{ 'type':'model','name':['cvlsu'],
     'author':'Ajala et al., (2019)',
     'ref':'Ajala, R., Persaud, P., Stock, J. M., Fuis, G. S., Hole, J. A., Goldman, M., & Scheirer, D. (2019). Three‐Dimensional Basin and Fault Structure From a Detailed Seismic Velocity Model of Coachella Valley, Southern California. Journal of Geophysical Research: Solid Earth,. doi:10.1029/2018JB016260'
},
{ 'type':'model','name':['cvmh'],
     'author':'Shaw et al., (2015)',
     'ref':'Shaw, J. H., et al. (2015), Unified structural representation of the southern California crust and upper mantle, Earth Planet. Sci. Lett., 415, 1–15, doi:10.1016/j.epsl.2015.01.016',
},
{ 'type':'model','name':['cvmhibbn','cvmhlabn','cvmhrbn','cvmhsbbn','cvmhsbcbn','cvmhsgbn','cvmhsmbn','cvmhstbn','cvmhvbn'],
     'author':'Plesch et al., (2021)',
     'ref':'Plesch, A., C.H. Thurber, C. Tape, and J.H. Shaw (2021, 08), The SCEC CVM effort: new basin models, enhanced access and tomographic updates. Oral Presentation at 2021 SCEC Annual Meeting',
},
{ 'type':'model','name':['cvms'],
     'author':'Magistrale et al., (2000)',
     'ref':'Magistrale, H, Day, S, Clayton, RW, Graves, RW (2000) The SCEC southern California ref three-dimensional seismic velocity model version 2. Bulletin of the Seismological Society of America 90(6B): S65–S76'
},
{ 'type':'model','name':['cvms'],
     'author':'Kohler et al., (2003)',
     'ref':'Kohler, MD, Magistrale, H, Clayton, RW (2003) Mantle heterogeneities and the SCEC ref three-dimensional seismic velocity model version 3. Bulletin of the Seismological Society of America 93(2): 757–774',
},
{ 'type':'model','name':['cvms5','cvmsi'],
     'author':'Lee et al., (2014)',
     'ref':'Lee, E.-J., P. Chen, T. H. Jordan, P. J. Maechling, M. A. M. Denolle, and G. C.Beroza (2014), Full 3-D tomography for crustal structure in Southern California based on the scattering-integral and the adjoint-waveﬁeld methods, J. Geophys. Res. Solid Earth, 119, doi:10.1002/2014JB011346. SCEC Contribution 6093',
},
{ 'type':'model','name':['ivlsu'],
     'author':'Persaud et al., (2016)',
     'refs': 'Persaud P., Y. Ma, J. M. Stock, J. Hole, G. Fuis and L. Han (2016), Fault zone characteristics and basin complexity in the southern Salton Trough, California , Geology, 44(9), p. 747-750, doi:10.1130/G38033.1',
},
{ 'type':'model','name':['uwlinca'],
     'author':'Lin et al., (2010)',
     'ref':'Lin, G., C. H. Thurber, H. Zhang, E. Hauksson, P. Shearer, F. Waldhauser, T. M. Brocher, and J. Hardebeck (2010), A California statewide three-dimensional seismic velocity model from both absolute and differential times. Bulletin of the Seismological Society of America, 100, 225-240. doi:10.1785/0120090028. SCEC Contribution 1360',
},
{ 'type':'model','name':['sfcvm'] },
{ 'type':'model','name':['sjfz'] },

{ 'type':'model','name':['uwsfbcvm'],
     'author':'Fang et al., (2016)',
     'ref':'Fang, H., H. Zhang, H. Yao, A. Allam, D. Zigone, Y. Ben-Zion, C. Thurber, and R. D. van der Hilst (2016), A new algorithm for three-dimensional joint inversion of body-wave and surface-wave data and its application to the Southern California Plate Boundary Region, J. Geophys. Res. Solid Earth, 121, doi:10.1002/2015JB012702',
},
{ 'type':'model','name':['uwsfbcvm'],
     'author':'Guo et al., (submitted)',
     'ref':'Guo, H., T. Taira, A. Nayak, C. H. Thurber, and E. Hirakawa, Three-dimensional seismic velocity models for the San Francisco Bay region, California from joint body-wave and surface-wave tomography validated by waveform simulation, J. Geophys. Res. Solid Earth, submitted',
},
{ 'type':'model','name':['wfcvm'],
     'author':'Magistrale et al., (2008)',
     'ref':'Magistrale, H, Olsen, KB, Pechmann, JC (2008) Construction and verification of a Wasatch front community velocity model. Technical report no. HQGR.060012, 14 pp. Reston, VA: US Geological Survey',
},
{ 'type':'map','name':['ucvm'],
     'author':'Thompson (2022)',
     'ref':'Thompson, E.M. (2022), An Updated Vs30 Map for California with Geologic and Topographic Constraints (ver. 2.0, July 2022): U.S. Geological Survey data release, doi:10.5066/F7JQ108S',
},
{ 'type':'map','name':['ucvm_utah'] },
{ 'type':'interpolator','name':['elygtl:ely'],
     'author':'Ely et al., (2010)',
     'ref':'Ely, G., T. H. Jordan, P. Small, P. J. Maechling (2010), A Vs30-derived Near-surface Seismic Velocity Model Abstract S51A-1907, presented at 2010 Fall Meeting, AGU, San Francisco, Calif., 13-17 Dec.'
},
{ 'type':'interpolator','name':['elygtl:taper']},
]

};

