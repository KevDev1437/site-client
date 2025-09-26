-- Ajouter des contraintes de sécurité pour les places et le stock

-- Contraintes pour la table workshops
ALTER TABLE workshops 
ADD CONSTRAINT check_seats_non_negative 
CHECK (seats >= 0);

ALTER TABLE workshops 
ADD CONSTRAINT check_total_seats_positive 
CHECK (total_seats > 0);

ALTER TABLE workshops 
ADD CONSTRAINT check_seats_not_exceed_total 
CHECK (seats <= total_seats);

-- Contraintes pour la table products
ALTER TABLE products 
ADD CONSTRAINT check_stock_non_negative 
CHECK (stock >= 0);

-- Contraintes pour la table reservations
ALTER TABLE reservations 
ADD CONSTRAINT check_reservation_status 
CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- Contraintes pour la table orders
ALTER TABLE orders 
ADD CONSTRAINT check_order_status 
CHECK (status IN ('pending', 'paid', 'failed', 'cancelled'));

ALTER TABLE orders 
ADD CONSTRAINT check_amount_positive 
CHECK (amount > 0);

-- Fonction pour vérifier la disponibilité des places avant réservation
CREATE OR REPLACE FUNCTION check_workshop_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier qu'il reste des places
  IF (SELECT seats FROM workshops WHERE id = NEW.workshop_id) <= 0 THEN
    RAISE EXCEPTION 'Plus de places disponibles pour cet atelier';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vérifier la disponibilité avant insertion d'une réservation
CREATE TRIGGER check_workshop_availability_trigger
  BEFORE INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION check_workshop_availability();

-- Fonction pour décrémenter automatiquement les places après réservation
CREATE OR REPLACE FUNCTION decrement_workshop_seats()
RETURNS TRIGGER AS $$
BEGIN
  -- Décrémenter les places seulement si la réservation est confirmée
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE workshops 
    SET seats = seats - 1 
    WHERE id = NEW.workshop_id AND seats > 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour décrémenter les places après confirmation d'une réservation
CREATE TRIGGER decrement_workshop_seats_trigger
  AFTER UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION decrement_workshop_seats();
