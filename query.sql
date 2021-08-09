CREATE TABLE newData(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   string     TEXT       NOT NULL, 
   integer    INTEGER    NOT NULL,
   float      REAL       NOT NULL,
   date       TEXT       NOT NULL,
   boolean    VARCHAR(5) NOT NULL
);

INSERT INTO newData(string, integer, float, date, boolean) VALUES 
('Testing Data', 12, 1.45, '2017-12-22', 'true'),
('Coba Lagi', 99, 100.405, '2017-11-20', 'false'),
('Super Sekali', 0, 1.45, 'kosong', 'false');