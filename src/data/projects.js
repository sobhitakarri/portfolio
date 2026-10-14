export const projects = [
  {
    id: 1,
    title: 'AERIS: Autonomous Language-Guided Drone',
    tagline: 'Closed-loop LLM/VLM reasoning, metric spatial grounding & real-time adaptive flight',
    date: 'Aug 2025 – Present',
    tags: ['Python', 'Gemini VLM', 'Simulink / Simscape', 'Unreal Engine', 'LiteWing ESP32-S3', 'FastAPI', 'Metric Grounding'],
    github: 'https://github.com/sobhitakarri/AERIS_llm_vlm_drone',
    category: 'Autonomy',
    metrics: [
      { label: 'Tracking RMSE', value: '1.4 cm' },
      { label: 'Waypoint Acc.', value: '0.1 – 0.3 cm' },
      { label: 'Camera Calib.', value: '0.78 px' },
      { label: 'Unit Tests', value: '218 passed' },
    ],
    pipeline: [
      'Natural Language Instruction',
      'Intent Routing',
      'VLM Detection',
      'Depth-Verified Grounding',
      'Skill Plan',
      'Safety Validator',
      'Obstacle-Aware Routing',
      'Flight Controller',
      'Dynamic Replan',
    ],
    highlights: [
      {
        title: 'Talk to a drone. It flies.',
        desc: 'Type a natural-language command — AERIS figures out what you mean, finds the target with a vision-language model, and physically flies there. No pre-programmed waypoints.',
      },
      {
        title: 'Why it matters',
        desc: 'Autonomous robots that understand human language can operate in real environments without expert programming. AERIS bridges the gap between saying what you want and the robot actually doing it.',
      },
      {
        title: 'How it works',
        desc: 'LLM plans the mission → VLM spots the target in the camera → depth-verified grounding pins it in 3D space → obstacle-aware path planner routes the flight → if the target moves mid-air, it replans on the fly.',
      },
    ],
    spec: `A closed-loop autonomous drone framework that translates natural-language instructions into validated flight skill sequences, localizes physical targets with vision-language models (VLM), grounds coordinates metrically in 3D space, and executes obstacle-aware trajectory routing. Features depth-verified grounding against ArUco-calibrated cameras, cascaded PID flight control, and real-time replanning when scenes change dynamically. Developed and evaluated against a Simulink/Simscape Multibody and Unreal Engine digital twin targeting a LiteWing ESP32-S3 micro-quadrotor.`,
    coverImage: '/projects/aeris/dashboard_mission.png',
    images: [
      {
        url: '/projects/aeris/dashboard_mission.png',
        caption: 'Mission Control Station: Live telemetry, Unreal 3D chase camera, overhead map & waypoint tracking on the digital twin.',
        tag: 'Dashboard',
      },
      {
        url: '/projects/aeris/perception_depth_proposals.jpg',
        caption: 'Perception & Grounding: Overhead depth segmentation with metric candidate proposals and grounded target bounding box.',
        tag: 'Perception',
      },
      {
        url: '/projects/aeris/case02_find_the_red_bottle_and_hover.gif',
        caption: 'Autonomous Flight Time-Lapse: "Find the red bottle and hover above it for 4s" executed on digital twin.',
        tag: 'Flight GIF',
      },
      {
        url: '/projects/aeris/case09_replan_moved_target.gif',
        caption: 'Dynamic Replanning Time-Lapse: Target object displaced 36 cm mid-hover; vehicle re-plans and tracks new position.',
        tag: 'Replan GIF',
      },
      {
        url: '/projects/aeris/camera_chase.jpg',
        caption: 'Unreal Lab Scene: Room chase camera viewing LiteWing micro-quadrotor and testing environment.',
        tag: 'Twin Scene',
      },
      {
        url: '/projects/aeris/camera_overhead_depth.jpg',
        caption: 'Overhead Metric Depth: Elevation map used for obstacle-aware collision avoidance and metric grounding.',
        tag: 'Depth Map',
      },
      {
        url: '/projects/aeris/benchmark_errors.png',
        caption: 'Empirical Benchmark: Sub-3 cm position accuracy across multi-modal natural language mission prompts.',
        tag: 'Benchmark',
      },
      {
        url: '/projects/aeris/validation_litewing_truth.png',
        caption: 'Controller Validation: Ground-truth Multibody plant trajectory tracking and velocity estimation.',
        tag: 'Validation',
      },
    ],
  },
  {
    id: 2,
    title: '6-DOF UR10 Robotic Car Painting Cell Simulation',
    tagline: 'Multi-surface trajectory planning, D-H kinematics, and collision simulation in CoppeliaSim',
    date: 'Jan 2026 – Present',
    tags: ['Python', 'CoppeliaSim (V-REP)', 'UR10 Robot', 'D-H Kinematics', 'Trajectory Planning', 'AABB Collision', 'Cleanroom Simulation'],
    github: 'https://github.com/sobhitakarri/Automated-Robotic-Car-Painting-Cell-Simulation',
    category: 'Robotics',
    metrics: [
      { label: 'Manipulator', value: 'UR10 6-DOF' },
      { label: 'Cleanroom Cell', value: '12 m × 8 m' },
      { label: 'Workpiece', value: 'Sedan 4.8×1.9×1.6m' },
      { label: 'Tool Standoff', value: '250 mm Const.' },
    ],
    pipeline: [
      'CAD Geometry & Surface Meshes',
      'Serpentine Raster Toolpath Generator',
      'Surface Normal Tool Alignment',
      'D-H Forward Kinematics',
      'Joint Limit Verification',
      'Two-Tier AABB Collision Checking',
      'CoppeliaSim Spray Simulation',
    ],
    highlights: [
      {
        title: 'A robot arm that paints cars — by itself.',
        desc: 'A UR10 6-DOF industrial manipulator automatically paints an entire full-scale sedan — hood, roof, sides, trunk — inside a simulated cleanroom, with zero human guidance during the cycle.',
      },
      {
        title: 'Why it matters',
        desc: 'Automotive painting is one of the most hazardous, repetitive jobs in manufacturing. Automating it consistently saves labour, reduces toxic exposure, and cuts rework from uneven coating.',
      },
      {
        title: 'How it works',
        desc: 'Python generates serpentine spray paths across each car surface → D-H kinematics converts paths to joint angles → collision checker ensures the arm never hits the car → CoppeliaSim visualises the full spray cycle with live paint deposition.',
      },
    ],
    spec: `Designed and simulated an automated industrial robotic spray-painting workcell for full-scale sedans (4.8 m × 1.9 m × 1.6 m) inside a 12 m × 8 m downdraft cleanroom booth. Developed Python modules for multi-surface serpentine raster trajectory planning maintaining continuous 250 mm standoff and surface-normal orientations, Denavit-Hartenberg (D-H) forward kinematics with joint-space boundary checks, and two-tier Axis-Aligned Bounding Box (AABB) collision verification. Executed in CoppeliaSim with rotary bell atomizer physics and dynamic spray deposition visualization.`,
    coverImage: '/projects/car-painting/cell_layout.png',
    images: [
      {
        url: '/projects/car-painting/cell_layout.png',
        caption: 'Cleanroom Cell Layout: 12 m × 8 m downdraft booth with UR10 articulated manipulator and full-scale sedan.',
        tag: 'Cell Layout',
      },
      {
        url: '/projects/car-painting/painting_hood.png',
        caption: 'Hood Coating: Serpentine raster trajectory with constant 250 mm standoff and surface-normal spray cone.',
        tag: 'Hood Spray',
      },
      {
        url: '/projects/car-painting/painting_roof.png',
        caption: 'Roof Coating: High-elevation toolpath orientation with dynamic surface deposition simulation.',
        tag: 'Roof Coating',
      },
      {
        url: '/projects/car-painting/painting_side.png',
        caption: 'Side Panels & Doors: Multi-axis articulated joint trajectory execution covering vertical automotive contours.',
        tag: 'Side Panels',
      },
      {
        url: '/projects/car-painting/rest_position.png',
        caption: 'Home / Rest Configuration: UR10 safe parked pose within cleanroom safety envelopes.',
        tag: 'Rest Pose',
      },
    ],
  },
  {
    id: 3,
    title: 'Self-Balancing Two-Wheeler',
    tagline: 'IMU-based stabilization and cascaded PID control for real-time balance',
    date: 'Mar 2025 – Jun 2025',
    tags: ['Arduino', 'IMU', 'PID', 'C++', 'Embedded'],
    github: 'https://github.com/sobhitakarri',
    category: 'Embedded',
    metrics: [
      { label: 'Control Loop', value: '200 Hz' },
      { label: 'Controller', value: 'Cascaded PID' },
      { label: 'Sensor Fusion', value: 'Complementary' },
    ],
    pipeline: [
      'IMU Accelerometer + Gyroscope',
      'Complementary Filter Tilt Estimation',
      'Cascaded Balance & Velocity PID',
      'PWM Motor Driver Actuation',
      'Real-Time Telemetry Interface',
    ],
    highlights: [
      {
        title: "A robot that doesn't fall over.",
        desc: 'Built a two-wheeled robot that stays upright on its own — no training wheels, no external supports. Just real-time physics fighting gravity at 200 times per second.',
      },
      {
        title: 'Why it matters',
        desc: 'Self-balancing is the foundation for everything from delivery bots to exoskeletons. Nailing the control loop in embedded hardware — where every millisecond counts — is a core robotics skill.',
      },
      {
        title: 'How it works',
        desc: 'IMU reads tilt 200× per second → complementary filter cleans up the noise → cascaded PID loop commands the motors to keep the centre of mass over the wheels. Tip too far → drive forward. Tip back → drive back.',
      },
    ],
    spec: `Built a self-balancing robot using IMU sensor fusion (accelerometer + gyroscope) with complementary filtering for accurate tilt estimation. Implemented cascaded PID controllers for balance stabilization and velocity control. Real-time embedded control loop running at 200Hz on Arduino with motor driver integration and tuning interface.`,
    coverImage: null,
    images: [],
  },
  {
    id: 4,
    title: 'FPGA-Based Logic Analyzer',
    tagline: 'Multi-channel real-time digital signal capture, protocol decoding & AXI4-Stream readout on Xilinx Basys-3',
    date: 'Jul 2025 – Present',
    tags: ['SystemVerilog', 'Verilog', 'FPGA', 'Basys-3', 'AXI4-Stream', 'SPI', 'I2C', 'GPIO'],
    github: 'https://github.com/sobhitakarri/Logic_Analyzer_using_FPGA',
    category: 'Hardware',
    metrics: [
      { label: 'Sample Rate', value: '50 MHz' },
      { label: 'Channels', value: '8 parallel' },
      { label: 'Timer Width', value: '46-bit' },
      { label: 'Architecture', value: '4× Analyzer Blocks' },
    ],
    pipeline: [
      'Hardware Pin Edge & Protocol Sniffing',
      'Protocol Decoders (GPIO / SPI / I2C)',
      'Pattern & Edge Trigger Matching',
      'Per-Block Local Ring Buffers',
      'Round-Robin Clump Arbiter',
      'Shared Dual-Port Ring Buffer RAM',
      'AXI4-Stream Master Packetizer',
      'MicroBlaze / Zynq DMA Ingestion',
    ],
    highlights: [
      {
        title: 'An oscilloscope — built from scratch on silicon.',
        desc: 'Captures and decodes live SPI, I2C and GPIO signals across 8 channels at 50 MHz, purely in hardware RTL. No software in the hot path — 4 parallel Analyzer Blocks, a round-robin arbiter, and a shared ring buffer stream 64-bit stamped samples over AXI4-Stream.',
      },
      {
        title: 'Why it matters',
        desc: 'Commercial logic analyzers cost thousands. Building one from RTL means you understand signal capture at the silicon level — and you can add custom triggers, protocols and timestamp resolutions that no off-the-shelf tool supports.',
      },
      {
        title: 'How it works',
        desc: 'Hardware decoders watch GPIO edges and SPI/I2C transactions → configurable trigger fires on any pattern or edge → local ring buffer locks in pre- and post-trigger data → round-robin arbiter fans 4 blocks into one shared RAM → AXI4-Stream master pushes 64-bit samples to MicroBlaze / Zynq CPU.',
      },
    ],
    spec: `Hierarchical FPGA-based logic analyzer built in SystemVerilog/Verilog on the Basys-3 board. Four parallel Analyzer Blocks each contain hardware decoders (GPIO edge, SPI, I2C), a 46-bit nanosecond-resolution timer, configurable trigger logic, and a local ring buffer. A round-robin arbiter fans all blocks into a shared on-chip RAM whose AXI4-Stream master port streams captured 64-bit samples (block ID + timestamp + protocol data) to an embedded processor. Testbenches validate individual decoders and trigger conditions in simulation.`,
    coverImage: '/projects/fpga-analyzer/arch_diagram.jpg',
    images: [
      {
        url: '/projects/fpga-analyzer/arch_diagram.jpg',
        caption: 'System Architecture: 4 parallel Analyzer Blocks fan into a round-robin arbiter → shared ring buffer → AXI4-Stream master → MicroBlaze / Zynq CPU.',
        tag: 'Architecture',
      },
      {
        url: '/projects/fpga-analyzer/block_detail.jpg',
        caption: 'Analyzer Block Internals: GPIO / SPI / I2C decoders feed a trigger unit and capture logic, with a 46-bit timer stamping every sample into the local ring buffer.',
        tag: 'Block Detail',
      },
      {
        url: '/projects/fpga-analyzer/waveform_capture.jpg',
        caption: 'Captured Waveform Output: SPI clock, MOSI data, and GPIO channel visualised with trigger marker — replayed from the 64-bit AXI4-Stream samples.',
        tag: 'Waveform',
      },
    ],
  },

  {
    id: 5,
    title: 'CNN Inference Accelerator',
    tagline: 'Hardware accelerator for convolutional neural network inference on FPGA',
    date: 'May 2025 – Jul 2025',
    tags: ['SystemVerilog', 'FPGA', 'CNN', 'RTL', 'DSP'],
    github: 'https://github.com/sobhitakarri',
    category: 'Hardware',
    metrics: [
      { label: 'Arithmetic', value: 'Fixed-Point' },
      { label: 'Architecture', value: 'Pipelined MAC' },
      { label: 'Target', value: 'FPGA DSP Slices' },
    ],
    pipeline: [
      'Layer Configuration Register File',
      'Quantized Fixed-Point Arithmetic',
      'Pipelined Convolution MAC Matrix',
      'On-Chip Activation & Pooling Unit',
      'BRAM Buffer Flow Management',
    ],
    highlights: [
      {
        title: 'AI inference — at hardware speed.',
        desc: 'Runs convolutional neural network layers directly in FPGA logic, orders of magnitude faster and more power-efficient than the same computation on a CPU.',
      },
      {
        title: 'Why it matters',
        desc: 'Edge AI on drones, robots, and IoT devices needs fast, low-power inference. GPU clouds are too slow and too expensive. Custom silicon hits both targets.',
      },
      {
        title: 'How it works',
        desc: 'RTL describes pipelined multiply-accumulate units → fixed-point weights pack into on-chip BRAM → convolution, pooling and activation layers stream through the hardware pipeline → results come out at clock speed, no CPU involved.',
      },
    ],
    spec: `Designed an RTL-level CNN inference accelerator targeting FPGA deployment. Implements convolution, pooling, and fully-connected layers with fixed-point arithmetic for efficient resource utilization. Features configurable kernel sizes, pipelined MAC units, and on-chip buffer management for minimal memory bandwidth.`,
    coverImage: null,
    images: [],
  },
]
