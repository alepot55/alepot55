## In short

- Traditional SLAM returns sparse point clouds or geometric meshes: useful for localization, visually far from the actual scene.
- SplatSLAM turns 3D Gaussian Splatting, designed for offline reconstruction, into a real-time incremental pipeline driven by a plain RGB camera.
- Tracking minimizes photometric error against a rendered view and mapping optimizes the Gaussians from covisibility-selected keyframes, with no feature detection and no depth sensor.
- The result is real-time dense reconstruction whose quality clearly exceeds mesh-based and point cloud-based SLAM, shown on room, kitchen and living room sequences.

## Why splatting instead of meshes

I wanted photo-realistic 3D reconstruction from nothing more than a standard RGB camera, in real time. Sparse points and geometric meshes do not get there.

3D Gaussian Splatting had just emerged as a breakthrough in neural rendering, reaching photorealistic quality with fast rendering times, but it was built for offline reconstruction from pre-captured images. Making it incremental was the work.

## What the system does per frame

- **Tracking**: the camera pose for each new frame comes from minimizing photometric error between the observed frame and a view rendered from the current 3D map. Pixel-level alignment only, no feature detection and no depth sensor.
- **Mapping**: keyframes are selected with a covisibility heuristic and used to optimize the 3D Gaussian Splatting representation. Each Gaussian stores position, covariance, color as spherical harmonics, and opacity, and the optimization refines these parameters as new views arrive.
- **Rendering**: the final map can be rendered from any viewpoint, producing continuous detailed surfaces rather than blocky meshes or scattered points.

## Implementation

The system is built as an extension to the Nerfstudio framework. It adapts the offline `splatfacto` method into a real-time incremental pipeline.

## Results

The system achieves real-time dense reconstruction from monocular RGB video, with reconstruction quality significantly exceeding traditional mesh-based or point cloud-based SLAM methods. The output is a 3D scene that can be freely explored with photo-realistic rendering.

Demonstrations on room, kitchen and living room sequences show the system handling diverse indoor environments with varying levels of complexity and scale.

## Context

The project was developed as part of the excellence program at Sapienza University of Rome and became the foundation for my bachelor's thesis.

The performance bottlenecks I hit here pushed me toward Triton and CUDA programming for dense mapping acceleration, which is where my later work on GPU kernel optimization started.
