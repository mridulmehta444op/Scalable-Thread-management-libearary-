# Scalable Thread Management Library (C++)

This project is a **Scalable Thread Management Library** written in **C++** that demonstrates how real-world thread pools work internally. Instead of creating a new thread for every task (which is inefficient and costly), this library creates a fixed number of worker threads once and reuses them to execute multiple tasks concurrently. The main objective of this project is to show practical **Operating System concepts** like multithreading, synchronization, task scheduling, and scalability in a clean and understandable way.

In this implementation, a **ThreadPool** class manages a group of worker threads and a shared task queue. Tasks are submitted as callable functions and stored safely in the queue. Each worker thread runs in a loop, waits for tasks using a condition variable, picks a task when available, and executes it. This avoids busy waiting and ensures efficient CPU utilization. Synchronization is handled using `std::mutex` to protect the critical section and `std::condition_variable` to coordinate between task producers and worker threads.

The project is scalable because threads are reused instead of recreated. When the number of tasks increases, the thread pool distributes them automatically across available threads. Increasing the number of threads can improve performance up to the limit of available CPU cores. Beyond that, adding more threads can actually reduce performance due to context switching overhead, which clearly demonstrates the difference between **concurrency and parallelism**.

The lifecycle of threads is managed properly. When the program ends, the destructor safely stops all worker threads, wakes them if they are waiting, and joins them to ensure no thread is left running in the background. This shows correct thread termination, which is a common mistake in beginner-level multithreading projects.

This project covers important OS-level concepts such as thread lifecycle management, mutual exclusion, critical sections, condition variables, the producer–consumer problem, and task scheduling. While the design is intentionally kept simple, it reflects how real systems handle concurrent task execution.

There are some limitations by design. The library does not implement priority scheduling, dynamic thread resizing, or task return values using futures and promises. These features can be added later, but they are excluded here to keep the focus on core thread management principles.

Overall, this project is suitable for an **Operating System lab or college project** and serves as a strong foundation for understanding how scalable multithreaded systems are built in C++. It focuses on correctness, clarity, and real concepts rather than superficial features.
