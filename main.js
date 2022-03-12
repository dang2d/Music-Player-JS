/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Music_Player_D2D';

const player = $('.player');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');

const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const progress = $('#progress');
const audio = $('#audio');
const playList = $('.playlist');

const app = {
    currentIndex: 0,
    indexArray: [],
    indexSum: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Ukulele',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/ukulele.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3'
        },
        {
            name: 'A new beginning',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/anewbeginning.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3'
        },
        {
            name: 'Jazzy frenchy',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/jazzyfrenchy.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3'
        },
        {
            name: 'Cute',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/cute.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-cute.mp3'
        },
        {
            name: 'Memories',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/memories.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-memories.mp3'
        },
        {
            name: 'Acoustic breeze',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/acousticbreeze.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3'
        },
        {
            name: 'Sunny',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/sunny.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3'
        },
        {
            name: 'Funny song',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/funnysong.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-funnysong.mp3'
        },
        {
            name: 'Tomorrow',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/tomorrow.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-tomorrow.mp3'
        },
        {
            name: 'Once again',
            singer: 'Benjamin',
            image: 'https://www.bensound.com/bensound-img/onceagain.jpg',
            path: 'https://www.bensound.com/bensound-music/bensound-onceagain.mp3'
        }
    ],
    
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
          get: function () {
            return this.songs[this.currentIndex]
          }
        });
    },

    // Func render songs
    renderSongs: function() {
        let htmls = this.songs.map((song, index) => {
            return `
                <div class="song" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playList.innerHTML = htmls.join('');
    },
    
    
    // Func handle events
    handleEvents: function() {
        const _this = this;
        
        // Scroll event
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            let scrollHeight = window.scrollY || document.documentElement.scrollTop;
            let cdNewWidth = cdWidth - scrollHeight;
            cd.style.width = cdNewWidth > 0 ? `${cdNewWidth}px` : 0;
            cd.style.opacity = cdNewWidth / cdWidth;
        };

        // Click Play event
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                _this.loadCurrentSong();
                audio.play();
            };
        };

        // Handle audio play/pause events
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdRotate.play();
        };
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdRotate.pause();
        };

        // Handel audio playing event
        audio.ontimeupdate = function() {
            if (audio.currentTime) {
                progress.value = audio.currentTime / audio.duration * 100;
            };
        };
        
        // Handle audio is seeked event
        progress.onchange = function() {
            audio.currentTime = progress.value * audio.duration / 100;
            // audio.play();
        };
        
        // CD rotate
        const cdRotate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10000ms = 10s
            iterations: Infinity
        });
        cdRotate.pause();
        
        // Click NextBtn event
        nextBtn.onclick = function() {
            let songList = Array.prototype.slice.call($$('.song'));
            let oldIndex = _this.currentIndex;
            let oldItemSong = songList.find(function(value) {
                return value.dataset.index == oldIndex;
            });
            oldItemSong.classList.remove('active');
            if (_this.isRandom) {
                _this.playRandomSong();
                // _this.loadCurrentSong();
                // audio.play();
            } else {
                _this.currentIndex++;
                if (_this.currentIndex >= _this.songs.length) {
                    _this.currentIndex = 0;
                }
            };
            _this.loadCurrentSong();
            audio.play();
        };
        // Click PrevBtn event
        prevBtn.onclick = function() {
            let songList = Array.prototype.slice.call($$('.song'));
            let oldIndex = _this.currentIndex;
            let oldItemSong = songList.find(function(value) {
                return value.dataset.index == oldIndex;
            });
            oldItemSong.classList.remove('active');
            if (_this.isRandom) {
                _this.playRandomSong();
                // _this.currentIndex = _this.indexArray.pop();
            } else {
                _this.currentIndex--;
                if (_this.currentIndex < 0) {
                    _this.currentIndex = _this.songs.length - 1;
                }
            }
            _this.loadCurrentSong();
            audio.play();
        };

        // Click RandomBtn event
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        // Handle audio end event
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            };
        };

        // Click RepeatBtn event
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // Click song element event
        playList.onclick = function(e) {
            let songNode = e.target.closest('.song:not(.active)');
            let optionNode = e.target.closest('.option');
            let oldIndex = _this.currentIndex;
            let songList = Array.prototype.slice.call($$('.song'));
            let oldItemSong = songList.find(function(value) {
                return value.dataset.index == oldIndex;
            });
            if (songNode || optionNode) {
                if (songNode && !optionNode) {
                    oldItemSong.classList.remove('active');
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    audio.play();
                }
                if (optionNode) {
                    console.log(optionNode);
                }

            }
        };

    },

    // Func play random song
    playRandomSong: function() {
        let newIndex = 0;
        if (this.indexSum >= this.songs.length) {
            this.indexSum = 0;
            this.indexArray = [];
        };
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex || this.indexArray.indexOf(newIndex) !== -1);
        this.indexArray.push(newIndex);
        this.indexSum++;
        this.currentIndex = newIndex;
    },
    
    // Func load current song
    loadCurrentSong: function() {
        this.setConfig('currentIndex', this.currentIndex);
        let header = document.querySelector('header h2');
        header.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        // Active song
        let songList = Array.prototype.slice.call($$('.song'));
        let itemSong = songList.find((value) => {
            return value.dataset.index == this.currentIndex;
        });
        if (itemSong) {
            itemSong.classList.add('active');
        }
        // Scroll into view
        setTimeout(() => {
            let songActive = $('.song.active');
            if (songActive) {
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            };
        }, 200);
    },

    // Func load config
    loadConfig: function() {
        this.isRandom = this.config.isRandom ? this.config.isRandom : false;
        this.isRepeat = this.config.isRepeat ? this.config.isRepeat : false;
        this.currentIndex = this.config.currentIndex ? this.config.currentIndex : 0;
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },

    // Start app
    start: function() {
        // Load config
        this.loadConfig();

        // Define property currentSong
        this.defineProperties();
        
        // Handle events
        this.handleEvents();

        this.loadCurrentSong();

        // Render songs
        this.renderSongs();
    }
};

app.start();