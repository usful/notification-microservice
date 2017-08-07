# Notifications Engine

## How it works?

It is made of two main parts, the controller and the workers, in general the controller is the one that distribute the tasks and the workers do the actual task.

controller.constructor - get how many workers it will spawn and the script of the worker to use

controller.setup() - create the workers, and track the state of each worker, also restart if the do not ping back

controller.run() - receives a function that when called returns a task, if not available it waits until it is available and stars the controller
