-- Insert a sophisticated Oscar-themed awards page design
-- This creates a complete, complex awards page with multiple layered elements

-- Clear existing elements
DELETE FROM awards_canvas_elements;

-- HERO SECTION
-- Background overlay
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)"}', 0, 0, 100, 600, 1, 1, '%', 'px', true, 1);

-- Decorative gold accent - top left
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, rotation, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "linear-gradient(180deg, rgba(212, 175, 55, 0.3) 0%, rgba(255, 215, 0, 0.1) 100%)"}', 0, 0, 30, 400, 2, -5, 0.6, '%', 'px', true, 2);

-- Decorative gold accent - bottom right
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, rotation, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "linear-gradient(180deg, rgba(255, 215, 0, 0.1) 0%, rgba(212, 175, 55, 0.3) 100%)"}', 70, 200, 30, 400, 2, 5, 0.6, '%', 'px', true, 3);

-- Main hero title
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('heading', '{"text": "ROTARACT MEDITERRANEAN", "level": "h1", "fontSize": "72px", "fontWeight": "900", "color": "#FFD700", "textAlign": "center", "fontFamily": "serif", "letterSpacing": "8px", "textShadow": "0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)", "lineHeight": "1.2"}', 10, 150, 80, 100, 10, '%', 'px', true, 4);

-- Hero subtitle
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('heading', '{"text": "AWARDS OF EXCELLENCE", "level": "h2", "fontSize": "36px", "fontWeight": "300", "color": "#FFFFFF", "textAlign": "center", "fontFamily": "serif", "letterSpacing": "12px"}', 15, 260, 70, 60, 10, 0.9, '%', 'px', true, 5);

-- Hero description
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('text', '{"text": "Celebrating outstanding achievements, exceptional leadership, and unwavering dedication to service excellence across the Mediterranean region.", "fontSize": "18px", "fontWeight": "400", "color": "#D4AF37", "textAlign": "center", "fontFamily": "sans-serif", "lineHeight": "1.8"}', 25, 340, 50, 80, 10, 0.95, '%', 'px', true, 6);

-- Decorative divider
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "#FFD700", "boxShadow": "0 0 20px rgba(255, 215, 0, 0.6)"}', 35, 450, 30, 4, 10, 0.8, '%', 'px', true, 7);

-- CTA Button
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('button', '{"text": "View All Winners", "url": "#winners", "backgroundColor": "#FFD700", "color": "#000000", "fontSize": "18px", "fontWeight": "700", "borderRadius": "4px", "border": "2px solid #D4AF37", "padding": "16px 32px", "boxShadow": "0 8px 24px rgba(255, 215, 0, 0.4)", "textAlign": "center"}', 37.5, 500, 25, 60, 10, '%', 'px', true, 8);

-- STATISTICS SECTION BACKGROUND
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "#0a0a0a"}', 0, 650, 100, 300, 1, '%', 'px', true, 9);

-- Statistics Title
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('heading', '{"text": "BY THE NUMBERS", "level": "h2", "fontSize": "42px", "fontWeight": "700", "color": "#FFD700", "textAlign": "center", "fontFamily": "serif", "letterSpacing": "6px"}', 10, 680, 80, 60, 5, '%', 'px', true, 10);

-- Stat Card 1
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "500+", "description": "Awards Presented", "backgroundColor": "rgba(255, 215, 0, 0.05)", "border": "2px solid rgba(212, 175, 55, 0.3)", "borderRadius": "12px", "padding": "32px", "textAlign": "center", "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.4)", "titleColor": "#FFD700", "titleSize": "56px", "descriptionColor": "#ffffff"}', 8, 770, 25, 140, 5, '%', 'px', true, 11);

-- Stat Card 2
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "15", "description": "Countries Represented", "backgroundColor": "rgba(255, 215, 0, 0.05)", "border": "2px solid rgba(212, 175, 55, 0.3)", "borderRadius": "12px", "padding": "32px", "textAlign": "center", "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.4)", "titleColor": "#FFD700", "titleSize": "56px", "descriptionColor": "#ffffff"}', 37.5, 770, 25, 140, 5, '%', 'px', true, 12);

-- Stat Card 3
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "10K+", "description": "Lives Impacted", "backgroundColor": "rgba(255, 215, 0, 0.05)", "border": "2px solid rgba(212, 175, 55, 0.3)", "borderRadius": "12px", "padding": "32px", "textAlign": "center", "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.4)", "titleColor": "#FFD700", "titleSize": "56px", "descriptionColor": "#ffffff"}', 67, 770, 25, 140, 5, '%', 'px', true, 13);

-- AWARD CATEGORIES SECTION
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)"}', 0, 1000, 100, 800, 1, '%', 'px', true, 14);

-- Categories Title
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('heading', '{"text": "AWARD CATEGORIES", "level": "h2", "fontSize": "48px", "fontWeight": "700", "color": "#FFD700", "textAlign": "center", "fontFamily": "serif", "letterSpacing": "6px"}', 10, 1030, 80, 60, 5, '%', 'px', true, 15);

-- Category Card 1 - Leadership Excellence
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "Leadership Excellence", "description": "Recognizing outstanding leadership that inspires change and drives innovation in service projects.", "backgroundColor": "rgba(0, 0, 0, 0.8)", "border": "3px solid #D4AF37", "borderRadius": "16px", "padding": "40px 24px", "textAlign": "center", "boxShadow": "0 12px 48px rgba(212, 175, 55, 0.2)", "titleColor": "#FFD700", "titleSize": "28px", "descriptionColor": "#cccccc"}', 5, 1120, 28, 200, 5, '%', 'px', true, 16);

-- Category Card 2 - Community Impact
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "Community Impact", "description": "Honoring projects that create lasting positive change in local and regional communities.", "backgroundColor": "rgba(0, 0, 0, 0.8)", "border": "3px solid #D4AF37", "borderRadius": "16px", "padding": "40px 24px", "textAlign": "center", "boxShadow": "0 12px 48px rgba(212, 175, 55, 0.2)", "titleColor": "#FFD700", "titleSize": "28px", "descriptionColor": "#cccccc"}', 36, 1120, 28, 200, 5, '%', 'px', true, 17);

-- Category Card 3 - Innovation Award
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "Innovation Award", "description": "Celebrating creative solutions and groundbreaking approaches to humanitarian challenges.", "backgroundColor": "rgba(0, 0, 0, 0.8)", "border": "3px solid #D4AF37", "borderRadius": "16px", "padding": "40px 24px", "textAlign": "center", "boxShadow": "0 12px 48px rgba(212, 175, 55, 0.2)", "titleColor": "#FFD700", "titleSize": "28px", "descriptionColor": "#cccccc"}', 67, 1120, 28, 200, 5, '%', 'px', true, 18);

-- Category Card 4 - Youth Empowerment
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "Youth Empowerment", "description": "Recognizing initiatives that empower young leaders and create opportunities for youth development.", "backgroundColor": "rgba(0, 0, 0, 0.8)", "border": "3px solid #D4AF37", "borderRadius": "16px", "padding": "40px 24px", "textAlign": "center", "boxShadow": "0 12px 48px rgba(212, 175, 55, 0.2)", "titleColor": "#FFD700", "titleSize": "28px", "descriptionColor": "#cccccc"}', 5, 1360, 28, 200, 5, '%', 'px', true, 19);

-- Category Card 5 - Environmental Stewardship
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "Environmental Stewardship", "description": "Honoring commitment to sustainability and environmental conservation efforts.", "backgroundColor": "rgba(0, 0, 0, 0.8)", "border": "3px solid #D4AF37", "borderRadius": "16px", "padding": "40px 24px", "textAlign": "center", "boxShadow": "0 12px 48px rgba(212, 175, 55, 0.2)", "titleColor": "#FFD700", "titleSize": "28px", "descriptionColor": "#cccccc"}', 36, 1360, 28, 200, 5, '%', 'px', true, 20);

-- Category Card 6 - International Collaboration
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "International Collaboration", "description": "Celebrating partnerships that bridge cultures and create global impact.", "backgroundColor": "rgba(0, 0, 0, 0.8)", "border": "3px solid #D4AF37", "borderRadius": "16px", "padding": "40px 24px", "textAlign": "center", "boxShadow": "0 12px 48px rgba(212, 175, 55, 0.2)", "titleColor": "#FFD700", "titleSize": "28px", "descriptionColor": "#cccccc"}', 67, 1360, 28, 200, 5, '%', 'px', true, 21);

-- TIMELINE SECTION
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "#000000"}', 0, 1850, 100, 600, 1, '%', 'px', true, 22);

-- Gold accent line for timeline
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "#FFD700", "boxShadow": "0 0 20px rgba(255, 215, 0, 0.4)"}', 48, 2000, 4, 400, 3, 0.6, '%', 'px', true, 23);

-- Timeline Title
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('heading', '{"text": "OUR JOURNEY", "level": "h2", "fontSize": "48px", "fontWeight": "700", "color": "#FFD700", "textAlign": "center", "fontFamily": "serif", "letterSpacing": "6px"}', 10, 1880, 80, 60, 5, '%', 'px', true, 24);

-- Timeline Event 1
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "2020", "description": "Inaugural Awards Ceremony - 50 recipients honored for exceptional service", "backgroundColor": "rgba(255, 215, 0, 0.08)", "border": "2px solid rgba(212, 175, 55, 0.4)", "borderRadius": "12px", "padding": "24px", "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.4)", "titleColor": "#FFD700", "titleSize": "32px", "descriptionColor": "#ffffff"}', 10, 2000, 35, 120, 5, '%', 'px', true, 25);

-- Timeline Event 2
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "2021", "description": "Expanded to 15 countries - 120 awards presented across multiple categories", "backgroundColor": "rgba(255, 215, 0, 0.08)", "border": "2px solid rgba(212, 175, 55, 0.4)", "borderRadius": "12px", "padding": "24px", "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.4)", "titleColor": "#FFD700", "titleSize": "32px", "descriptionColor": "#ffffff"}', 55, 2080, 35, 120, 5, '%', 'px', true, 26);

-- Timeline Event 3
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "2023", "description": "Record-breaking year - 200+ nominations and 85 awards presented", "backgroundColor": "rgba(255, 215, 0, 0.08)", "border": "2px solid rgba(212, 175, 55, 0.4)", "borderRadius": "12px", "padding": "24px", "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.4)", "titleColor": "#FFD700", "titleSize": "32px", "descriptionColor": "#ffffff"}', 10, 2240, 35, 120, 5, '%', 'px', true, 27);

-- Timeline Event 4
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('card', '{"title": "2024", "description": "Digital transformation - Virtual ceremony reaches global audience of 10,000+", "backgroundColor": "rgba(255, 215, 0, 0.08)", "border": "2px solid rgba(212, 175, 55, 0.4)", "borderRadius": "12px", "padding": "24px", "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.4)", "titleColor": "#FFD700", "titleSize": "32px", "descriptionColor": "#ffffff"}', 55, 2160, 35, 120, 5, '%', 'px', true, 28);

-- CLOSING SECTION
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)"}', 0, 2500, 100, 400, 1, '%', 'px', true, 29);

-- Closing Title
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('heading', '{"text": "NOMINATE A LEADER", "level": "h2", "fontSize": "48px", "fontWeight": "700", "color": "#FFD700", "textAlign": "center", "fontFamily": "serif", "letterSpacing": "6px"}', 10, 2550, 80, 60, 5, '%', 'px', true, 30);

-- Closing Text
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('text', '{"text": "Know someone making a difference? Nominations for the 2025 Awards are now open. Help us recognize the exceptional leaders shaping our communities.", "fontSize": "20px", "fontWeight": "400", "color": "#FFFFFF", "textAlign": "center", "fontFamily": "sans-serif", "lineHeight": "1.8"}', 20, 2640, 60, 80, 5, 0.9, '%', 'px', true, 31);

-- Final CTA Button
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, position_unit, size_unit, is_visible, display_order) VALUES
('button', '{"text": "Submit Nomination", "url": "#nominate", "backgroundColor": "#FFD700", "color": "#000000", "fontSize": "20px", "fontWeight": "700", "borderRadius": "4px", "border": "2px solid #D4AF37", "padding": "18px 40px", "boxShadow": "0 8px 32px rgba(255, 215, 0, 0.5)", "textAlign": "center"}', 35, 2760, 30, 60, 10, '%', 'px', true, 32);

-- Decorative gold particles (small accent boxes)
INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "#FFD700", "borderRadius": "50%", "boxShadow": "0 0 20px rgba(255, 215, 0, 0.8)"}', 15, 2580, 3, 3, 4, 0.6, '%', 'px', true, 33);

INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "#D4AF37", "borderRadius": "50%", "boxShadow": "0 0 15px rgba(212, 175, 55, 0.7)"}', 82, 2620, 2.5, 2.5, 4, 0.5, '%', 'px', true, 34);

INSERT INTO awards_canvas_elements (element_type, content, x_position, y_position, width, height, z_index, opacity, position_unit, size_unit, is_visible, display_order) VALUES
('div', '{"backgroundColor": "#FFD700", "borderRadius": "50%", "boxShadow": "0 0 18px rgba(255, 215, 0, 0.9)"}', 8, 2750, 2, 2, 4, 0.7, '%', 'px', true, 35);
