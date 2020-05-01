# Executive Summary

Software development in the enterprise is undergoing rapid and widespread change. Application architectures
are moving from monolithic and N-tier to cloud-native microservices while the development process has transitioned
from waterfall through agile to a DevOps focus. Meanwhile, deployments have moved from the data center to hosted
environments and now the cloud (public, private, and hybrid) and release cycles have shrunk from quarterly to
weekly, or even more frequently. To remain competitive, businesses require functionality to be delivered in a
faster and more streamlined manner, while facing ever-increasing security threats.

Red Hat®  OpenShift Container Platform 4.2 offers a consistent, self-managing enterprise Kubernetes platform that
spans the hybrid cloud. OpenShift 4 drives developer productivity while limiting operational complexities with
native automation, providing a Kubernetes platform that pairs production-readiness with cloud-native innovation.

This Reference Configuration for Red Hat OpenShift Container Platform (OCP) on HPE SimpliVity is ideal for customer
migrating legacy applications to containers, transitioning to a container DevOps development model or needing a
hybrid environment to support container and non-containerized applications on a common VM platform. It
provides a solution for IT operations, addressing the need for a production-ready environment that
is easy to deploy and manage. It describes how to automate and accelerate the provisioning of the environment
using a set of Ansible playbooks which, once configured, can deploy a cluster in thirty minutes. It also addresses
post-deployment tasks such as enabling cluster logging, adding additional worker (compute) nodes, and backup and restore.



**Target Audience:** This document is primarily aimed at technical individuals working in the operations side of
the software pipeline, such as infrastructure architects, system administrators and infrastructure engineers, but
anybody with an interest in automating the provisioning of virtual servers and containers may find this document
useful.

**Assumptions:** A minimum understanding of concepts such as virtualization and
containerization and also some knowledge around Linux® and VMware® technologies.
