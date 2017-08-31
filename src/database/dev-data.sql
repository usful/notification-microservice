INSERT INTO account
(external_id, name, email, sms, delivery, language)
VALUES
(101, 'Test User One', 'info@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(102, 'Test User Two', 'info+2@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(103, 'Test User Three', 'info+3@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(104, 'Test User Four', 'info+4@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en'),
(105, 'Test User Five', 'info+5@joinlane.com', '+1 416-000-0000', '{"email","sms"}', 'en');

INSERT INTO template
(name, email, push, sms, web, voice)
VALUES
(
    'template1',
    '{"subject": "<%= user.name %> test", "text": "<%= user.name %>, <%= user.id %>", "html": "<%= user.name %>, <%= user.id %>"}',
    '{"message": "<%= user.name %> test"}',
    '{"body": "<%= user.name %> test"}',
    '{"message": "<%= user.name %> test"}',
    '{"message": "<%= user.name %> test"}'
),
(
    'template2',
    '{"subject": "<%= user.name %> test", "text": "<%= user.name %>, <%= user.id %>", "html": "<%= user.name %>, <%= user.id %>"}',
    '{"message": "<%= user.name %> test"}',
    '{"message": "<%= user.name %> test"}',
    '{"message": "<%= user.name %> test"}',
    '{"message": "<%= user.name %> test"}'
);