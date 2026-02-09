## Motivation

Traditional SLAM systems produce sparse point clouds or geometric meshes. These are useful for localization, but visually far from the actual scene. I wanted to build a system that produces **photo-realistic** 3D reconstructions from nothing more than a standard RGB camera, in real-time.

3D Gaussian Splatting had just emerged as a breakthrough in neural rendering, achieving photorealistic quality with fast rendering times. But it was designed for offline reconstruction from pre-captured images. I adapted it into a real-time SLAM pipeline.

## The Approach

SplatSLAM runs a continuous loop over incoming RGB frames:

**Tracking**: for each new frame, the system estimates the camera's pose by minimizing photometric error between the observed frame and a rendered view from the current 3D map. No feature detection, no depth sensor, just pixel-level alignment.

**Mapping**: keyframes are selected using a covisibility heuristic and used to optimize the 3D Gaussian Splatting representation. Each Gaussian stores position, covariance, color (spherical harmonics), and opacity. The optimization incrementally refines these parameters as new views arrive.

**Rendering**: the final map can be rendered from any viewpoint, producing images that are qualitatively close to the original video: not blocky meshes or scattered points, but continuous, detailed surfaces.

The system is built as an extension to the Nerfstudio framework, adapting the `splatfacto` offline method into a real-time incremental pipeline.

## Results

The system achieves real-time dense reconstruction from monocular RGB video, with reconstruction quality significantly exceeding traditional mesh-based or point cloud-based SLAM methods. The output is a 3D scene that can be freely explored with photo-realistic rendering.

Demonstrations on room, kitchen, and living room sequences show the system handling diverse indoor environments with varying levels of complexity and scale.

## Context

This project was developed as part of the excellence program at Sapienza University of Rome and became the foundation for my bachelor's thesis. It directly informed my subsequent work on GPU kernel optimization. The performance bottlenecks I encountered here led me to explore Triton and CUDA programming for dense mapping acceleration.
