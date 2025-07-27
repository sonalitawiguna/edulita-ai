-- RLS Policies for Users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Schools table
CREATE POLICY "School members can view their school" ON public.schools
    FOR SELECT USING (
        id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Principals can update their school" ON public.schools
    FOR UPDATE USING (
        principal_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

-- RLS Policies for Classes table
CREATE POLICY "School members can view classes" ON public.classes
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage their classes" ON public.classes
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('principal', 'superadmin')
        )
    );

-- RLS Policies for Students table
CREATE POLICY "Students can view their own data" ON public.students
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Teachers can view their students" ON public.students
    FOR SELECT USING (
        class_id IN (
            SELECT id FROM public.classes WHERE teacher_id = auth.uid()
        )
    );

-- RLS Policies for Teachers table
CREATE POLICY "Teachers can view their own data" ON public.teachers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "School staff can view teachers" ON public.teachers
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

-- RLS Policies for Assignments table
CREATE POLICY "Students can view their assignments" ON public.assignments
    FOR SELECT USING (
        class_id IN (
            SELECT class_id FROM public.students WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage their assignments" ON public.assignments
    FOR ALL USING (teacher_id = auth.uid());

-- RLS Policies for Submissions table
CREATE POLICY "Students can manage their submissions" ON public.submissions
    FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view submissions for their assignments" ON public.submissions
    FOR SELECT USING (
        assignment_id IN (
            SELECT id FROM public.assignments WHERE teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can grade submissions" ON public.submissions
    FOR UPDATE USING (
        assignment_id IN (
            SELECT id FROM public.assignments WHERE teacher_id = auth.uid()
        )
    );

-- RLS Policies for Quizzes table
CREATE POLICY "Users can view quizzes" ON public.quizzes
    FOR SELECT USING (true);

CREATE POLICY "Teachers can create quizzes" ON public.quizzes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('teacher', 'principal', 'superadmin')
        )
    );

CREATE POLICY "Quiz creators can update their quizzes" ON public.quizzes
    FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for Quiz Attempts table
CREATE POLICY "Students can view their quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('teacher', 'principal', 'superadmin')
        )
    );

-- RLS Policies for Documents table
CREATE POLICY "Users can view their documents" ON public.documents
    FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Users can upload documents" ON public.documents
    FOR INSERT WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update their documents" ON public.documents
    FOR UPDATE USING (uploaded_by = auth.uid());

-- RLS Policies for Chat Messages table
CREATE POLICY "Users can view their chat messages" ON public.chat_messages
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (user_id = auth.uid());
