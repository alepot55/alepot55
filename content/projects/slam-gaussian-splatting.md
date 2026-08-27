## Two classical SLAM outputs, sparse points and meshes, localize without resembling the room

Sparse point clouds and geometric meshes both place a camera in space, and neither looks like the scene it came from. 3D Gaussian Splatting was the alternative: photo-realistic quality at fast render times, published for offline reconstruction from images captured in advance.

## Tracking runs on one photometric error term and zero feature detectors

The pose for each incoming frame comes from minimizing the photometric error between that frame and a view rendered from the map as it currently stands. Nothing is detected or matched, and the alignment runs pixel against pixel.

## Mapping optimizes four parameters per Gaussian, from covisibility-selected keyframes

Every Gaussian in the map carries a position, a covariance, a color as spherical harmonics, and an opacity. A covisibility heuristic decides which keyframes enter the optimization, and each new view refines those four parameters for the Gaussians it touches.

## I rewrote one offline method, `splatfacto`, into an incremental loop

Nerfstudio ships `splatfacto` for the offline case, where the full image set exists before optimization begins. Making it accept frames as the camera moves, and interleaving that with tracking, was the work.

## Three indoor sequences: room, kitchen, living room

The demonstrations cover indoor scenes of differing scale and clutter, and the finished map renders from any viewpoint as continuous surfaces. I compared it against mesh-based and point cloud SLAM by looking at the renders; there is no error metric behind that comparison.

## The 2024 bottleneck sent me to Triton and CUDA

I built this for the excellence program at Sapienza University of Rome. The performance bottlenecks in dense mapping pushed me toward Triton and CUDA, where my later work on GPU kernel optimization started.
