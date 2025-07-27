-- Insert sample schools
INSERT INTO public.schools (id, name, address, accreditation, total_students, total_teachers) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'SMA Negeri 1 Jakarta', 'Jl. Budi Kemuliaan No. 6, Jakarta Pusat', 'A', 1250, 45),
('550e8400-e29b-41d4-a716-446655440002', 'SMA Negeri 2 Bandung', 'Jl. Cihampelas No. 123, Bandung', 'A', 980, 38),
('550e8400-e29b-41d4-a716-446655440003', 'SMA Negeri 1 Surabaya', 'Jl. Wijaya Kusuma No. 48, Surabaya', 'B', 850, 32);

-- Insert sample users (Note: In real implementation, these would be created through Supabase Auth)
-- This is just for demonstration - actual user creation should go through auth.users first

-- Insert sample classes
INSERT INTO public.classes (id, name, grade, school_id, student_count) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'X IPA 1', '10', '550e8400-e29b-41d4-a716-446655440001', 32),
('660e8400-e29b-41d4-a716-446655440002', 'X IPA 2', '10', '550e8400-e29b-41d4-a716-446655440001', 30),
('660e8400-e29b-41d4-a716-446655440003', 'XI IPA 1', '11', '550e8400-e29b-41d4-a716-446655440001', 28),
('660e8400-e29b-41d4-a716-446655440004', 'XII IPA 1', '12', '550e8400-e29b-41d4-a716-446655440001', 25);

-- Insert sample quizzes
INSERT INTO public.quizzes (id, title, subject, difficulty, questions) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Kuis Aljabar Dasar', 'Matematika', 'easy', '[
    {
        "id": "1",
        "question": "Berapakah hasil dari 2x + 5 = 15?",
        "options": ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
        "correctAnswer": 0,
        "explanation": "Untuk menyelesaikan 2x + 5 = 15, kurangi 5 dari kedua sisi: 2x = 10, kemudian bagi dengan 2: x = 5"
    },
    {
        "id": "2",
        "question": "Manakah yang merupakan bilangan prima?",
        "options": ["15", "17", "21", "25"],
        "correctAnswer": 1,
        "explanation": "17 adalah bilangan prima karena hanya dapat dibagi oleh 1 dan dirinya sendiri"
    }
]'),
('770e8400-e29b-41d4-a716-446655440002', 'Kuis Hukum Newton', 'Fisika', 'medium', '[
    {
        "id": "1",
        "question": "Hukum Newton I menyatakan bahwa...",
        "options": [
            "Benda bergerak dengan kecepatan konstan jika tidak ada gaya yang bekerja",
            "F = ma",
            "Setiap aksi memiliki reaksi yang sama besar dan berlawanan arah",
            "Energi tidak dapat diciptakan atau dimusnahkan"
        ],
        "correctAnswer": 0,
        "explanation": "Hukum Newton I (Hukum Inersia) menyatakan bahwa benda akan tetap diam atau bergerak lurus beraturan jika tidak ada gaya luar yang bekerja"
    }
]');

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
