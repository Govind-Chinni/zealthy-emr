SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE((SELECT MAX(id) FROM "User"), 1));
SELECT setval(pg_get_serial_sequence('"Appointment"', 'id'), COALESCE((SELECT MAX(id) FROM "Appointment"), 1));
SELECT setval(pg_get_serial_sequence('"Prescription"', 'id'), COALESCE((SELECT MAX(id) FROM "Prescription"), 1));
SELECT setval(pg_get_serial_sequence('"Medication"', 'id'), COALESCE((SELECT MAX(id) FROM "Medication"), 1));
SELECT setval(pg_get_serial_sequence('"Dosage"', 'id'), COALESCE((SELECT MAX(id) FROM "Dosage"), 1));