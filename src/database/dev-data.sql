
INSERT INTO account
(external_id, name, email, sms, delivery, language)
VALUES
(101, 'Test User One', 'info@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(102, 'Test User Two', 'info+2@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(103, 'Test User Three', 'info+3@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(104, 'Test User Four', 'info+4@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(105, 'Test User Five', 'info+5@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en');

INSERT INTO template
(name, email)
VALUES
('template1', 'some lib template'),
('template2', 'some lib template');
