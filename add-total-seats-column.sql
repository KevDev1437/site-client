-- Ajouter la colonne total_seats pour stocker le nombre total de places initiales
ALTER TABLE workshops 
ADD COLUMN total_seats INTEGER DEFAULT 0;

-- Initialiser total_seats avec les valeurs actuelles de seats pour les ateliers existants
-- Cela signifie que les ateliers commencent avec toutes les places libres
UPDATE workshops 
SET total_seats = seats 
WHERE total_seats = 0;

-- Ajouter une contrainte pour s'assurer que total_seats est positif
ALTER TABLE workshops 
ADD CONSTRAINT check_total_seats_positive 
CHECK (total_seats > 0);

-- Ajouter une contrainte pour s'assurer que seats ne peut pas être négatif
ALTER TABLE workshops 
ADD CONSTRAINT check_seats_non_negative 
CHECK (seats >= 0);

-- Ajouter une contrainte pour s'assurer que seats ne peut pas dépasser total_seats
ALTER TABLE workshops 
ADD CONSTRAINT check_seats_not_exceed_total 
CHECK (seats <= total_seats);
