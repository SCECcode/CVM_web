UPDATE %%cvmtb%_tb SET geom = ST_SetSRID(ST_MakePoint(LON,LAT),4326); 
CREATE INDEX ON %%cvmtb%_tb USING GIST ("geom");
