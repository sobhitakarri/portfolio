export const blogPosts = [
  {
    id: 1,
    title: 'Building a Logic Analyzer on FPGA from Scratch',
    date: 'Jun 2024',
    readTime: '8 min read',
    tags: ['FPGA', 'Verilog', 'Xilinx'],
    excerpt: 'How I designed, implemented, and debugged an 8-channel logic analyzer on the Basys 3 — from ring buffer design to Python GUI waveform rendering.',
    content: `What started as a lab debugging tool turned into one of my most rewarding builds. The core challenge was designing a ring-buffer-based capture engine that could sample 8 channels at 50 MHz while simultaneously streaming captured data over UART without dropping a single bit.\n\nThe trigger logic was the hardest part — implementing edge detection across all 8 channels simultaneously, with separate pre-trigger and post-trigger windows, required careful thought about timing synchronization. After that, the UART streaming module was relatively straightforward thanks to an async FIFO decoupling the capture and transmit clock domains.`,
  },
  {
    id: 2,
    title: 'UVM from Zero: Building Your First Testbench',
    date: 'Aug 2024',
    readTime: '12 min read',
    tags: ['UVM', 'SystemVerilog', 'Verification'],
    excerpt: 'A ground-up walkthrough of UVM methodology — agents, sequences, scoreboards, and functional coverage — using an SPI controller as the DUT.',
    content: `UVM felt overwhelming when I first opened the class reference manual. The sheer number of base classes (uvm_object, uvm_component, uvm_agent, uvm_env…) made it feel more like object-oriented programming than hardware verification.\n\nThe key insight that changed everything: think of UVM as a pluggable test harness. Your DUT is the board, the agent is the oscilloscope + signal generator combo, and the scoreboard is your brain saying "that shouldn't have happened." Once that mental model clicked, the class hierarchy made sense.`,
  },
  {
    id: 3,
    title: 'My First ASIC: An 8-bit ALU through OpenLane',
    date: 'Dec 2024',
    readTime: '10 min read',
    tags: ['ASIC', 'OpenLane', 'Sky130', 'RTL'],
    excerpt: 'Walking through my first complete RTL→GDSII flow using OpenLane and the SkyWater 130nm PDK — synthesis, placement, routing, DRC, and GDSII.',
    content: `Getting silicon (even virtual silicon) from a Verilog file is a different experience than any FPGA flow. The first time I opened the GDS in KLayout and zoomed into the routed metal layers of my ALU, I could see the individual cells — inverters, NAND gates, flip-flops — physically placed and connected.\n\nOpenLane automates a lot, but it also exposes you to concepts you glossed over in RTL: OCV corners, parasitic extraction, setup/hold slack, antenna violations. Each DRC violation tells a story about the physical constraints of real transistor geometry.`,
  },
]
