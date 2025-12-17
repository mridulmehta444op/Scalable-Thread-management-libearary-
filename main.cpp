#include <iostream>
#include "ThreadPool.h"

void exampleTask(int id) {
    std::cout << "Task " << id
              << " running on thread "
              << std::this_thread::get_id()
              << std::endl;
}

int main() {
    ThreadPool pool(4);

    for (int i = 1; i <= 8; i++) {
        pool.submitTask([i]() {
            exampleTask(i);
        });
    }

    return 0;
}