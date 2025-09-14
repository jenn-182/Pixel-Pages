-- Clear existing data first
DELETE FROM player_achievements;
DELETE FROM focus_entries;
DELETE FROM tasks;
DELETE FROM notes;  
DELETE FROM notebooks;
DELETE FROM folders;
DELETE FROM players;

-- Create the player record for Jroc_182
INSERT INTO players (id, username, avatar_url, level, experience, rank, join_date, last_login) VALUES 
(1, 'Jroc_182', NULL, 1, 0, 'NOVICE SCRIBE', '2024-08-15 09:00:00', '2024-08-15 09:00:00');

-- Create folders with high IDs to avoid conflicts
INSERT INTO folders (id, name, created_at, updated_at) VALUES 
(100, 'Fall 2024', '2024-08-15 09:00:00', '2024-08-15 09:00:00'),
(101, 'Spring 2025', '2025-01-10 10:00:00', '2025-01-10 10:00:00');

-- Create notebooks with high IDs
INSERT INTO notebooks (id, name, created_at, updated_at) VALUES 
(200, 'Computer Science 101', '2024-08-20 14:00:00', '2024-08-20 14:00:00'),
(201, 'Calculus I', '2024-08-20 15:00:00', '2024-08-20 15:00:00'),
(202, 'Data Structures', '2025-01-15 11:00:00', '2025-01-15 11:00:00'),
(203, 'Statistics', '2025-01-15 12:00:00', '2025-01-15 12:00:00');

-- Create notes with high IDs
INSERT INTO notes (id, title, content, notebook_id, username, tags, created_at, updated_at) VALUES 
(300, 'Introduction to Programming - CS101', 
'# Introduction to Programming

## What is Programming?
Programming is the process of creating instructions for computers to follow. Today we covered:

### Key Concepts
- **Variables**: Storage containers for data
- **Functions**: Reusable blocks of code  
- **Loops**: Repetitive execution structures
- **Conditionals**: Decision-making logic

### First Program
```python
def hello_world():
    print("Hello, World!")
    return "Success"
```

### Assignment
Write a program that calculates the area of a rectangle using length and width inputs.

**Due**: Next class
**Points**: 10

### Notes
- Remember to comment your code
- Use meaningful variable names
- Test edge cases', 
200, 'Jroc_182', 'programming,basics,python,homework', '2024-08-22 10:30:00', '2024-08-22 10:30:00'),

(301, 'Limits and Continuity - Calculus', 
'# Limits and Continuity - Chapter 2

## Definition of a Limit
The limit of f(x) as x approaches a is L if we can make f(x) arbitrarily close to L by taking x sufficiently close to a.

### Mathematical Notation
lim(x→a) f(x) = L

## Types of Limits
1. **One-sided limits**
   - Left-hand limit: lim(x→a⁻) f(x)
   - Right-hand limit: lim(x→a⁺) f(x)

2. **Two-sided limits** 
   - Exists only if left and right limits are equal

## Continuity
A function f is continuous at x = a if:
- f(a) is defined
- lim(x→a) f(x) exists  
- lim(x→a) f(x) = f(a)

### Examples Worked in Class
1. f(x) = x² + 3x - 2, find lim(x→1) f(x)
2. Piecewise function continuity check

## Homework Problems
Section 2.2: Problems 15, 18, 22, 25-30
**Due**: Friday

### Study Tips
- Practice graphing functions
- Memorize limit laws
- Work through discontinuity examples',
201, 'Jroc_182', 'calculus,limits,continuity,math,homework', '2024-08-25 11:15:00', '2024-08-25 11:15:00'),

(302, 'Arrays and Linked Lists - Data Structures',
'# Arrays and Linked Lists - Lecture 3

## Arrays
### Definition  
Contiguous memory locations storing elements of the same type.

### Advantages
- **O(1)** random access by index
- Cache-friendly due to locality
- Simple implementation

### Disadvantages  
- Fixed size (static arrays)
- Expensive insertion/deletion at beginning
- Memory waste if not fully utilized

## Linked Lists
### Definition
Linear data structure where elements (nodes) contain data and reference to next node.

### Node Structure
```java
class Node {
    int data;
    Node next;
    
    Node(data) {
        this.data = data;
        this.next = null;
    }
}
```

### Advantages
- Dynamic size
- Efficient insertion/deletion at beginning O(1)
- No memory waste

### Disadvantages
- No random access - O(n) to find element
- Extra memory for pointers
- Not cache-friendly

## Comparison
| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access | O(1) | O(n) |
| Insert at start | O(n) | O(1) |
| Insert at end | O(1) | O(n) |
| Delete | O(n) | O(1) if node known |

## Assignment
Implement both array and linked list versions of a simple stack.
**Due**: Next Wednesday
**Points**: 25',
202, 'Jroc_182', 'data-structures,arrays,linked-lists,java,assignment', '2025-01-20 14:20:00', '2025-01-20 14:20:00'),

(303, 'Probability Distributions - Statistics', 
'# Probability Distributions - Chapter 6

## Random Variables
### Definition
A function that assigns numerical values to outcomes of a random experiment.

### Types
- **Discrete**: Countable outcomes (dice roll, coin flip)
- **Continuous**: Uncountable outcomes (height, weight, time)

## Discrete Probability Distributions

### Binomial Distribution  
Models number of successes in n independent trials.
- Parameters: n (trials), p (success probability)
- Formula: P(X = k) = C(n,k) × p^k × (1-p)^(n-k)

### Example
Probability of getting exactly 3 heads in 5 coin flips:
P(X = 3) = C(5,3) × (0.5)³ × (0.5)² = 10 × 0.125 × 0.25 = 0.3125

## Continuous Distributions

### Normal Distribution
- Bell-shaped curve
- Parameters: μ (mean), σ (standard deviation)  
- 68-95-99.7 rule
- Standard normal: μ = 0, σ = 1

### Applications
- Test scores
- Heights and weights
- Measurement errors

## Homework
Chapter 6: Problems 12, 15-18, 23, 27-30, 35
**Due**: Monday

### Exam Notice
Midterm exam covers chapters 1-6
**Date**: February 15th
**Format**: Multiple choice + problems
**Study guide** posted on course website',
203, 'Jroc_182', 'statistics,probability,distributions,normal,binomial,exam', '2025-01-22 13:45:00', '2025-01-22 13:45:00');

-- Create tasks with high IDs
INSERT INTO tasks (id, title, description, completed, priority, due_date, username, created_at, updated_at) VALUES
-- Completed assignments (8 total)
(400, 'CS101 Rectangle Program', 'Write a program that calculates rectangle area', 1, 'medium', '2024-08-29 23:59:00', 'Jroc_182', '2024-08-22 15:00:00', '2024-08-28 20:30:00'),
(401, 'Calculus Limit Problems', 'Section 2.2: Problems 15, 18, 22, 25-30', 1, 'high', '2024-08-30 23:59:00', 'Jroc_182', '2024-08-25 16:00:00', '2024-08-29 19:45:00'),
(402, 'Read Chapter 3 - Functions', 'Read textbook chapter on functions', 1, 'low', '2024-09-02 23:59:00', 'Jroc_182', '2024-08-30 10:00:00', '2024-09-01 14:20:00'),
(403, 'CS101 Quiz 1 Prep', 'Study variables, loops, conditionals', 1, 'high', '2024-09-05 09:00:00', 'Jroc_182', '2024-09-01 18:00:00', '2024-09-04 22:15:00'),
(404, 'Calculus Homework Ch 2.3', 'Derivative introduction problems', 1, 'medium', '2024-09-06 23:59:00', 'Jroc_182', '2024-09-02 11:00:00', '2024-09-05 21:30:00'),
(405, 'Buy textbooks', 'Get required books for spring semester', 1, 'medium', '2025-01-12 17:00:00', 'Jroc_182', '2025-01-08 14:00:00', '2025-01-11 16:30:00'),
(406, 'Register for classes', 'Complete spring registration', 1, 'high', '2024-11-15 17:00:00', 'Jroc_182', '2024-11-10 09:00:00', '2024-11-14 13:45:00'),
(407, 'Data Structures Stack Assignment', 'Implement array and linked list stacks', 1, 'high', '2025-01-29 23:59:00', 'Jroc_182', '2025-01-22 15:00:00', '2025-01-28 23:30:00'),

-- Pending tasks (7 total)
(408, 'Statistics Homework Ch 6', 'Problems 12, 15-18, 23, 27-30, 35', 0, 'high', '2025-01-27 23:59:00', 'Jroc_182', '2025-01-22 16:00:00', '2025-01-22 16:00:00'),
(409, 'Study for Statistics Midterm', 'Review chapters 1-6, practice problems', 0, 'high', '2025-02-14 23:59:00', 'Jroc_182', '2025-01-22 17:00:00', '2025-01-22 17:00:00'),
(410, 'CS Project Proposal', 'Submit final project proposal', 0, 'medium', '2025-02-01 23:59:00', 'Jroc_182', '2025-01-15 12:00:00', '2025-01-15 12:00:00'),
(411, 'Laundry', 'Do weekly laundry', 0, 'low', '2025-01-25 18:00:00', 'Jroc_182', '2025-01-23 08:00:00', '2025-01-23 08:00:00'),
(412, 'Call Mom', 'Weekly check-in call', 0, 'medium', '2025-01-26 20:00:00', 'Jroc_182', '2025-01-23 19:00:00', '2025-01-23 19:00:00'),
(413, 'Grocery Shopping', 'Get food for the week', 0, 'medium', '2025-01-25 16:00:00', 'Jroc_182', '2025-01-24 10:00:00', '2025-01-24 10:00:00'),
(414, 'Office Hours - Data Structures', 'Meet TA for help with trees', 0, 'low', '2025-01-28 15:00:00', 'Jroc_182', '2025-01-24 11:00:00', '2025-01-24 11:00:00');

-- Create focus sessions matching the current database schema
INSERT INTO focus_sessions (id, name, description, color_code, category, work_duration, break_duration, cycles, owner_username, is_active, total_time_logged, created_at, updated_at) VALUES
(1, 'Study Session', 'Learning and research', '#3B82F6', 'LEARNING', 25, 5, 1, 'Jroc_182', true, 25, '2024-08-20 09:00:00', '2024-08-20 09:25:00'),
(2, 'Deep Focus', 'Concentrated study', '#10B981', 'LEARNING', 30, 5, 1, 'Jroc_182', true, 30, '2024-08-21 14:00:00', '2024-08-21 14:30:00'),
(3, 'Research Time', 'Academic research', '#8B5CF6', 'LEARNING', 40, 10, 1, 'Jroc_182', true, 40, '2024-08-22 16:00:00', '2024-08-22 16:40:00'),
(4, 'Work Focus', 'Professional tasks', '#F59E0B', 'WORK', 45, 10, 1, 'Jroc_182', true, 45, '2024-08-23 10:00:00', '2024-08-23 10:45:00'),
(5, 'Project Work', 'Long work session', '#DC2626', 'WORK', 60, 15, 1, 'Jroc_182', true, 60, '2024-08-24 15:00:00', '2024-08-24 16:00:00'),
(6, 'Team Meeting', 'Collaborative work', '#059669', 'WORK', 50, 10, 1, 'Jroc_182', true, 50, '2024-08-25 11:00:00', '2024-08-25 11:50:00'),
(7, 'Quick Task', 'Short work burst', '#7C3AED', 'WORK', 25, 5, 1, 'Jroc_182', true, 25, '2024-08-26 13:00:00', '2024-08-26 13:25:00'),
(8, 'Creative Time', 'Art and creativity', '#EC4899', 'CREATIVE', 45, 10, 1, 'Jroc_182', true, 45, '2024-08-27 17:00:00', '2024-08-27 17:45:00'),
(9, 'Programming Session', 'Coding and development', '#6366F1', 'WORK', 35, 5, 1, 'Jroc_182', true, 35, '2024-08-28 19:00:00', '2024-08-28 19:35:00'),
(10, 'Dev Work', 'Programming tasks', '#14B8A6', 'WORK', 45, 10, 1, 'Jroc_182', true, 45, '2024-08-29 20:00:00', '2024-08-29 20:45:00'),
(11, 'Code Review', 'Technical review', '#F97316', 'WORK', 45, 10, 1, 'Jroc_182', true, 45, '2024-08-30 21:00:00', '2024-08-30 21:45:00'),
(12, 'Reading Time', 'Literature and learning', '#84CC16', 'LEARNING', 30, 5, 1, 'Jroc_182', true, 30, '2024-09-01 08:00:00', '2024-09-01 08:30:00'),
(13, 'Meditation', 'Mindfulness practice', '#06B6D4', 'PERSONAL', 25, 5, 1, 'Jroc_182', true, 25, '2024-09-02 07:00:00', '2024-09-02 07:25:00'),
(14, 'Mindful Break', 'Personal wellness', '#8B5CF6', 'PERSONAL', 30, 10, 1, 'Jroc_182', true, 30, '2024-09-03 18:00:00', '2024-09-03 18:30:00'),
(15, 'Wellness Time', 'Health and mindfulness', '#EF4444', 'HEALTH', 30, 5, 1, 'Jroc_182', true, 30, '2024-09-04 19:00:00', '2024-09-04 19:30:00'),
(16, 'Quick Study', 'Knowledge acquisition', '#F59E0B', 'LEARNING', 15, 5, 1, 'Jroc_182', true, 15, '2024-09-05 12:00:00', '2024-09-05 12:15:00');

-- Insert focus entries that correspond to the sessions above
-- These will help unlock achievements for Jroc_182
INSERT INTO focus_entries (id, session_id, owner_username, time_spent, date, start_time, end_time, completed, notes, is_manual_entry, phase, cycle_number, created_at, category) VALUES
-- Study sessions (LEARNING category)
(1001, 1, 'Jroc_182', 25, '2024-08-20', '2024-08-20 09:00:00', '2024-08-20 09:25:00', true, 'Focused study session on algorithms', false, 'work', 1, '2024-08-20 09:25:00', 'LEARNING'),
(1002, 2, 'Jroc_182', 30, '2024-08-21', '2024-08-21 14:00:00', '2024-08-21 14:30:00', true, 'Deep focus work on data structures', false, 'work', 1, '2024-08-21 14:30:00', 'LEARNING'),
(1003, 3, 'Jroc_182', 40, '2024-08-22', '2024-08-22 16:00:00', '2024-08-22 16:40:00', true, 'Research on calculus problems', false, 'work', 1, '2024-08-22 16:40:00', 'LEARNING'),
(1004, 12, 'Jroc_182', 30, '2024-09-01', '2024-09-01 08:00:00', '2024-09-01 08:30:00', true, 'Reading technical documentation', false, 'work', 1, '2024-09-01 08:30:00', 'LEARNING'),
(1005, 16, 'Jroc_182', 15, '2024-09-05', '2024-09-05 12:00:00', '2024-09-05 12:15:00', true, 'Quick study break', false, 'work', 1, '2024-09-05 12:15:00', 'LEARNING'),

-- Work sessions (WORK category) 
(1006, 4, 'Jroc_182', 45, '2024-08-23', '2024-08-23 10:00:00', '2024-08-23 10:45:00', true, 'Professional project work', false, 'work', 1, '2024-08-23 10:45:00', 'WORK'),
(1007, 5, 'Jroc_182', 60, '2024-08-24', '2024-08-24 15:00:00', '2024-08-24 16:00:00', true, 'Long work session for major project', false, 'work', 1, '2024-08-24 16:00:00', 'WORK'),
(1008, 6, 'Jroc_182', 50, '2024-08-25', '2024-08-25 11:00:00', '2024-08-25 11:50:00', true, 'Team collaboration and planning', false, 'work', 1, '2024-08-25 11:50:00', 'WORK'),
(1009, 7, 'Jroc_182', 25, '2024-08-26', '2024-08-26 13:00:00', '2024-08-26 13:25:00', true, 'Quick task completion', false, 'work', 1, '2024-08-26 13:25:00', 'WORK'),
(1010, 9, 'Jroc_182', 35, '2024-08-28', '2024-08-28 19:00:00', '2024-08-28 19:35:00', true, 'Programming and development', false, 'work', 1, '2024-08-28 19:35:00', 'WORK'),
(1011, 10, 'Jroc_182', 45, '2024-08-29', '2024-08-29 20:00:00', '2024-08-29 20:45:00', true, 'Backend development work', false, 'work', 1, '2024-08-29 20:45:00', 'WORK'),
(1012, 11, 'Jroc_182', 45, '2024-08-30', '2024-08-30 21:00:00', '2024-08-30 21:45:00', true, 'Code review and optimization', false, 'work', 1, '2024-08-30 21:45:00', 'WORK'),

-- Creative and personal sessions
(1013, 8, 'Jroc_182', 45, '2024-08-27', '2024-08-27 17:00:00', '2024-08-27 17:45:00', true, 'Creative design work', false, 'work', 1, '2024-08-27 17:45:00', 'CREATIVE'),
(1014, 13, 'Jroc_182', 25, '2024-09-02', '2024-09-02 07:00:00', '2024-09-02 07:25:00', true, 'Morning meditation', false, 'work', 1, '2024-09-02 07:25:00', 'PERSONAL'),
(1015, 14, 'Jroc_182', 30, '2024-09-03', '2024-09-03 18:00:00', '2024-09-03 18:30:00', true, 'Evening mindfulness', false, 'work', 1, '2024-09-03 18:30:00', 'PERSONAL'),
(1016, 15, 'Jroc_182', 30, '2024-09-04', '2024-09-04 19:00:00', '2024-09-04 19:30:00', true, 'Health and wellness time', false, 'work', 1, '2024-09-04 19:30:00', 'HEALTH');