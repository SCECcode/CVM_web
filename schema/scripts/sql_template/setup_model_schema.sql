CREATE TABLE %%cvmtb%_tb (
   gid     serial PRIMARY KEY,
   LON     float DEFAULT 0.0,
   LAT     float DEFAULT 0.0,
   VS      float DEFAULT 0.0,  
);
SELECT AddGeometryColumn('','%%cvmtb%_tb','geom','0','POINT',2);


