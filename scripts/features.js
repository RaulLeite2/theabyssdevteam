// Features rotation and code preview
const features = {
    python: {
        fileName: 'the_abyss_bot.py',
        code: `<span class="keyword">import</span> discord
<span class="keyword">from</span> discord.ext <span class="keyword">import</span> commands
<span class="keyword">import</span> asyncio

<span class="keyword">class</span> <span class="class-name">TheAbyssBot</span>(commands.Bot):
    <span class="keyword">def</span> <span class="function">__init__</span>(self):
        <span class="function">super</span>().__init__(
            command_prefix=<span class="string">"!"</span>,
            intents=discord.Intents.all()
        )
        self.rpg_system = <span class="class-name">AlbionRPG</span>()
    
    <span class="keyword">async def</span> <span class="function">on_ready</span>(self):
        <span class="function">print</span>(<span class="string">f'Bot ready: {self.user}'</span>)
        <span class="keyword">await</span> self.<span class="function">load_extensions</span>()

<span class="comment"># Initialize The Abyss Bot</span>
bot = <span class="class-name">TheAbyssBot</span>()
bot.<span class="function">run</span>(<span class="string">TOKEN</span>)`
    },
    web: {
        fileName: 'index.html',
        code: `<span class="keyword">&lt;!DOCTYPE</span> <span class="class-name">html</span><span class="keyword">&gt;</span>
<span class="keyword">&lt;html</span> lang=<span class="string">"en"</span><span class="keyword">&gt;</span>
<span class="keyword">&lt;head&gt;</span>
    <span class="keyword">&lt;meta</span> charset=<span class="string">"UTF-8"</span><span class="keyword">&gt;</span>
    <span class="keyword">&lt;title&gt;</span>The Abyss Team<span class="keyword">&lt;/title&gt;</span>
    <span class="keyword">&lt;link</span> rel=<span class="string">"stylesheet"</span> href=<span class="string">"css/style.css"</span><span class="keyword">&gt;</span>
<span class="keyword">&lt;/head&gt;</span>
<span class="keyword">&lt;body&gt;</span>
    <span class="keyword">&lt;nav</span> class=<span class="string">"navbar"</span><span class="keyword">&gt;</span>
        <span class="keyword">&lt;h2&gt;</span>The Abyss Team<span class="keyword">&lt;/h2&gt;</span>
    <span class="keyword">&lt;/nav&gt;</span>
    <span class="comment">&lt;!-- Hero Section --&gt;</span>
<span class="keyword">&lt;/body&gt;</span>
<span class="keyword">&lt;/html&gt;</span>`
    },
    csharp: {
        fileName: 'Program.cs',
        code: `<span class="keyword">using</span> System;
<span class="keyword">using</span> System.Threading.Tasks;

<span class="keyword">namespace</span> <span class="class-name">TheAbyssTeam</span>
{
    <span class="keyword">class</span> <span class="class-name">Program</span>
    {
        <span class="keyword">static async</span> Task <span class="function">Main</span>(<span class="keyword">string</span>[] args)
        {
            <span class="keyword">var</span> app = <span class="keyword">new</span> <span class="class-name">Application</span>();
            <span class="keyword">await</span> app.<span class="function">RunAsync</span>();
            
            Console.<span class="function">WriteLine</span>(<span class="string">"The Abyss application started"</span>);
        }
    }
}`
    },
    bots: {
        fileName: 'albion_rpg.py',
        code: `<span class="keyword">class</span> <span class="class-name">AlbionRPG</span>:
    <span class="keyword">def</span> <span class="function">__init__</span>(self):
        self.players = {}
        self.economy = <span class="class-name">EconomySystem</span>()
        self.combat = <span class="class-name">CombatSystem</span>()
    
    <span class="keyword">async def</span> <span class="function">create_character</span>(self, user_id, name):
        character = {
            <span class="string">'name'</span>: name,
            <span class="string">'level'</span>: <span class="string">1</span>,
            <span class="string">'gold'</span>: <span class="string">100</span>,
            <span class="string">'inventory'</span>: [],
            <span class="string">'stats'</span>: {
                <span class="string">'hp'</span>: <span class="string">100</span>,
                <span class="string">'attack'</span>: <span class="string">10</span>,
                <span class="string">'defense'</span>: <span class="string">5</span>
            }
        }
        self.players[user_id] = character
        <span class="keyword">return</span> character
    
    <span class="comment"># Complete RPG system based on Albion</span>`
    },
    railway: {
        fileName: 'railway.toml',
        code: `<span class="comment"># Railway Deployment Configuration</span>
[build]
builder = <span class="string">"NIXPACKS"</span>

[deploy]
startCommand = <span class="string">"python main.py"</span>
restartPolicyType = <span class="string">"ON_FAILURE"</span>
restartPolicyMaxRetries = <span class="string">10</span>

[environment]
PYTHON_VERSION = <span class="string">"3.11"</span>
PORT = <span class="string">"8080"</span>

<span class="comment"># Auto-scaling configuration</span>
[scaling]
minInstances = <span class="string">1</span>
maxInstances = <span class="string">5</span>

<span class="comment"># The Abyss Bot on Railway</span>`
    },
    training: {
        fileName: 'python_course.py',
        code: `<span class="keyword">class</span> <span class="class-name">PythonTrainingCourse</span>:
    <span class="string">"""
    Comprehensive Python Training Program
    From Fundamentals to Advanced Topics
    """</span>
    
    <span class="keyword">def</span> <span class="function">__init__</span>(self):
        self.modules = [
            <span class="string">"Python Basics"</span>,
            <span class="string">"Data Structures"</span>,
            <span class="string">"OOP Programming"</span>,
            <span class="string">"Web Development"</span>,
            <span class="string">"Discord Bots"</span>,
            <span class="string">"API Development"</span>,
            <span class="string">"Deployment"</span>
        ]
    
    <span class="keyword">def</span> <span class="function">start_course</span>(self, student):
        <span class="function">print</span>(<span class="string">f"Welcome {student}!"</span>)
        <span class="comment"># Hands-on learning with real projects</span>
        <span class="keyword">return</span> <span class="string">"Course started!"</span>`
    }
};

let currentFeatureIndex = 0;
const featureKeys = Object.keys(features);
let autoRotateInterval;

// Update code preview
function updateCodePreview(featureKey) {
    const feature = features[featureKey];
    const fileNameEl = document.getElementById('fileName');
    const codeContentEl = document.getElementById('codeContent');
    
    if (fileNameEl && codeContentEl) {
        fileNameEl.textContent = feature.fileName;
        codeContentEl.innerHTML = `<pre><code>${feature.code}</code></pre>`;
    }
}

// Update active feature
function setActiveFeature(featureKey) {
    // Remove active class from all items and reset animation
    document.querySelectorAll('.feature-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Force reflow to restart animation
    void document.body.offsetWidth;
    
    // Add active class to selected item
    const activeItem = document.querySelector(`[data-feature="${featureKey}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Update code preview
    updateCodePreview(featureKey);
}

// Auto-rotate features
function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        currentFeatureIndex = (currentFeatureIndex + 1) % featureKeys.length;
        setActiveFeature(featureKeys[currentFeatureIndex]);
    }, 5000); // Change every 5 seconds (matches CSS animation)
}

function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set up click handlers for feature items
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            stopAutoRotate();
            currentFeatureIndex = index;
            setActiveFeature(featureKeys[index]);
            // Restart auto-rotate after 10 seconds of inactivity
            setTimeout(() => startAutoRotate(), 10000);
        });
    });
    
    // Start auto-rotation
    startAutoRotate();
    
    // Initialize with first feature
    setActiveFeature(featureKeys[0]);
});
