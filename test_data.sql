-- Clear existing data first
DELETE FROM tasks;
DELETE FROM notes;  
DELETE FROM notebooks;
DELETE FROM folders;

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
200, 'user', 'programming,basics,python,homework', '2024-08-22 10:30:00', '2024-08-22 10:30:00'),

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
201, 'user', 'calculus,limits,continuity,math,homework', '2024-08-25 11:15:00', '2024-08-25 11:15:00'),

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
    
    Node(int data) {
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
202, 'user', 'data-structures,arrays,linked-lists,java,assignment', '2025-01-20 14:20:00', '2025-01-20 14:20:00'),

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
203, 'user', 'statistics,probability,distributions,normal,binomial,exam', '2025-01-22 13:45:00', '2025-01-22 13:45:00');

-- Create tasks with high IDs
INSERT INTO tasks (id, title, description, completed, priority, due_date, username, created_at, updated_at) VALUES
-- Completed assignments (8 total)
(400, 'CS101 Rectangle Program', 'Write a program that calculates rectangle area', 1, 'medium', '2024-08-29 23:59:00', 'user', '2024-08-22 15:00:00', '2024-08-28 20:30:00'),
(401, 'Calculus Limit Problems', 'Section 2.2: Problems 15, 18, 22, 25-30', 1, 'high', '2024-08-30 23:59:00', 'user', '2024-08-25 16:00:00', '2024-08-29 19:45:00'),
(402, 'Read Chapter 3 - Functions', 'Read textbook chapter on functions', 1, 'low', '2024-09-02 23:59:00', 'user', '2024-08-30 10:00:00', '2024-09-01 14:20:00'),
(403, 'CS101 Quiz 1 Prep', 'Study variables, loops, conditionals', 1, 'high', '2024-09-05 09:00:00', 'user', '2024-09-01 18:00:00', '2024-09-04 22:15:00'),
(404, 'Calculus Homework Ch 2.3', 'Derivative introduction problems', 1, 'medium', '2024-09-06 23:59:00', 'user', '2024-09-02 11:00:00', '2024-09-05 21:30:00'),
(405, 'Buy textbooks', 'Get required books for spring semester', 1, 'medium', '2025-01-12 17:00:00', 'user', '2025-01-08 14:00:00', '2025-01-11 16:30:00'),
(406, 'Register for classes', 'Complete spring registration', 1, 'high', '2024-11-15 17:00:00', 'user', '2024-11-10 09:00:00', '2024-11-14 13:45:00'),
(407, 'Data Structures Stack Assignment', 'Implement array and linked list stacks', 1, 'high', '2025-01-29 23:59:00', 'user', '2025-01-22 15:00:00', '2025-01-28 23:30:00'),

-- Pending tasks (7 total)
(408, 'Statistics Homework Ch 6', 'Problems 12, 15-18, 23, 27-30, 35', 0, 'high', '2025-01-27 23:59:00', 'user', '2025-01-22 16:00:00', '2025-01-22 16:00:00'),
(409, 'Study for Statistics Midterm', 'Review chapters 1-6, practice problems', 0, 'high', '2025-02-14 23:59:00', 'user', '2025-01-22 17:00:00', '2025-01-22 17:00:00'),
(410, 'CS Project Proposal', 'Submit final project proposal', 0, 'medium', '2025-02-01 23:59:00', 'user', '2025-01-15 12:00:00', '2025-01-15 12:00:00'),
(411, 'Laundry', 'Do weekly laundry', 0, 'low', '2025-01-25 18:00:00', 'user', '2025-01-23 08:00:00', '2025-01-23 08:00:00'),
(412, 'Call Mom', 'Weekly check-in call', 0, 'medium', '2025-01-26 20:00:00', 'user', '2025-01-23 19:00:00', '2025-01-23 19:00:00'),
(413, 'Grocery Shopping', 'Get food for the week', 0, 'medium', '2025-01-25 16:00:00', 'user', '2025-01-24 10:00:00', '2025-01-24 10:00:00'),
(414, 'Office Hours - Data Structures', 'Meet TA for help with trees', 0, 'low', '2025-01-28 15:00:00', 'user', '2025-01-24 11:00:00', '2025-01-24 11:00:00');