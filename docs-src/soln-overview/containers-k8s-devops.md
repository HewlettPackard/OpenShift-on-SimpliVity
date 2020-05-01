# Kubernetes overview

## Containers

Containers are often viewed as lightweight virtual machines (VMs). While a VM has its own complete operating system
sitting on top of a hypervisor, containers are sandboxes running directly on top of the host system’s kernel and, as a
result, are faster and less resource intensive.

Developers initially adopted containers as a means to package up their code, along with all of its dependencies and
configuration details, to run it anywhere - public, private or hybrid cloud. By simplifying the development environment,
container technology allowed developers to run multiple versions of their own applications and 3rd party software on a
single workstation without annoying conflicts. As a result, containers became a common, standardized building block for
software development and led to the demise of the "it works on my machine" scenario.

Containers have been around for a long time in the Linux world, but Docker popularized them by making them easy and
efficient to use and by providing a public registry of standardized container images for 3rd party software. In the past,
container technology had been perceived to be prone to security vulnerabilities, in particular to "breakout" where
malicious code could escape the sandbox and access sensitive information on the host. Over the years, extensive work has
been done to reduce the attack surface and to limit the blast-radius should any attack succeed. As a result, running
applications on containers can now significantly reduce the impact of any attack due to the underlying protections
provided.

Containers also facilitated the adoption of microservices architectures where, instead of developing single monolithic
programs, applications are split up into a set of independent services that communicate with each other via well-defined
interfaces (APIs). As a result, the container has now become the standardized unit for software development for packaging,
composition, deployment, scaling and re-use. However, to deploy and maintain a reliable distributed system using all
these containers, another layer of management software is required and that is role of the container orchestrator.

## Container orchestration

A container orchestrator is a piece of software that attempts to automate the operations that would traditionally be performed by a system administrator. This includes:

- Scaling applications up and down, depending on demand
- Load balancing across containers
- Restarting individual containers that fail
- Replacing and rescheduling containers when an underlying host node dies
- Managing compute, memory, network and storage resources
- Optimizing resource utilization
- Automating the roll-out and rollback of deployments
- Allowing services to discover other services in the system
- Monitoring and centralized logging

The use of an orchestrator typically results in increased container density, leading to improved overall utilization of resources. In addition, the average lifetime of a container also decreases significantly as the orchestrator restarts, removes or relocates containers when auto-scaling or when node failure occurs.


## Kubernetes

Kubernetes is an open-source container orchestrator project, founded by Google in 2014 and based on the internal
distributed systems that support some of Google's most popular applications.

A number of proprietary container orchestration systems have been available, including Docker Swarm and Mesosphere DC/OS.
However, the DevOps community rapidly converged to make Kubernetes the de-facto standard and most commercial offerings
have now pivoted to include Kubernetes as part of their offerings. It should be noted that Kubernetes also underpins
offerings from all the main cloud providers such as Amazon's Elastic Container Service for Kubernetes (EKS), Microsoft's
Azure Kubernetes Service (AKS) and Google's own Kubernetes Engine (GKE). This ability to support on-premises, public
cloud and hybrid deployments using a single technology and avoiding vendor lock-in, helps further confirm the grip
Kubernetes has on the DevOps mindset.

For more information on Kubernetes, refer to [https://kubernetes.io/](https://kubernetes.io/)
