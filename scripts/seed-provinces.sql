-- Script pour insérer les 26 provinces de la RDC
-- Exécutez ce script sur votre base de données de production

INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('4620c296-ac40-4293-b345-64c979aefcae', 'Kinshasa', 'CD-KN', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('72053a99-c167-4cd1-ac26-d5914f451c2a', 'Kongo-Central', 'CD-BC', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('139f2ca2-fa72-4ae2-815c-a6234f2200dc', 'Kwango', 'CD-KG', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('c56aeaf1-4132-4c86-8697-adbe95cdacd1', 'Kwilu', 'CD-KL', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('f32f5c35-fa14-43fb-9299-b8bb2ae3e2b3', 'Mai-Ndombe', 'CD-MN', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('1d3fb3b3-4201-49d8-8493-f1cb6f1d7e90', 'Équateur', 'CD-EQ', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('34fde519-5265-4c36-a48d-5f0809ebb3c2', 'Mongala', 'CD-MO', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('0b4b73f2-389e-4ba9-82d4-31178a10531c', 'Nord-Ubangi', 'CD-NU', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('f0804e40-4075-4ee3-ac04-126c712c53e6', 'Sud-Ubangi', 'CD-SU', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('9c2d6d5e-1c6c-4ee4-8915-92affd6b55a8', 'Tshuapa', 'CD-TU', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('04c72456-9aad-4bea-8bcc-13796e781d4c', 'Tshopo', 'CD-TO', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('0b8b985b-5e72-4262-862a-7f7b6b6a6359', 'Bas-Uele', 'CD-BU', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('cd32f86d-f626-44de-aca9-d17fa37b40ba', 'Haut-Uele', 'CD-HU', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('3a8724ad-baad-4055-9e7e-bbfcd3b88166', 'Ituri', 'CD-IT', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('f8cdb672-4b91-438e-9b67-73f9cb9af1e2', 'Nord-Kivu', 'CD-NK', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('93d146ce-f5c6-4731-8d92-a97952b73b53', 'Sud-Kivu', 'CD-SK', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('38cacaba-bc8a-4546-a179-3b0b02beafed', 'Maniema', 'CD-MA', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('c761a6f4-7a0a-4812-83a7-4579dded29e5', 'Sankuru', 'CD-SA', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('703c9249-916a-4cbb-a6b2-01ca730a8b66', 'Kasaï', 'CD-KS', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('8d16d5b9-2ac6-49ca-9947-df0e1da0e644', 'Kasaï-Central', 'CD-KC', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('05b3719b-d212-427f-a4fe-2319700975cf', 'Kasaï-Oriental', 'CD-KE', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('e20e5d4d-761a-4f76-81a8-04c815a501f0', 'Lomami', 'CD-LO', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('e643465d-c15a-47ac-9cc0-6c248793e5f6', 'Haut-Lomami', 'CD-HL', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('3930f603-df6b-45fa-8ab6-ba0b489f7555', 'Tanganyika', 'CD-TA', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('9ce030f6-8984-4406-8180-707d87730602', 'Haut-Katanga', 'CD-HK', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO provinces (id, name, code, "createdAt", "updatedAt") VALUES ('d20bdf19-0a08-4e55-a20a-070ac8be31b7', 'Lualaba', 'CD-LU', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

-- Vérification
SELECT COUNT(*) as total_provinces FROM provinces;
