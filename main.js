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
            name: 'Ngày đầu tiên',
            singer: 'Đức Phúc',
            image: 'https://data.chiasenhac.com/data/cover/155/154910.jpg',
            path: 'https://data.chiasenhac.com/down2/2224/0/2223570-77fd7172/128/Ngay%20Dau%20Tien%20-%20Duc%20Phuc.mp3'
        },
        {
            name: 'Đau nhất là lặng im',
            singer: 'Erik; Cukak',
            image: 'https://data.chiasenhac.com/data/cover/157/156137.jpg',
            path: 'https://data.chiasenhac.com/down2/2228/0/2227190-3da28ade/128/Dau%20Nhat%20La%20Lang%20Im%20Cukak%20Remix_%20-%20Erik_.mp3'
        },
        {
            name: 'Chìm Sâu',
            singer: 'MCK; Trung Trần',
            image: 'https://data.chiasenhac.com/data/cover/158/157044.jpg',
            path: 'https://data.chiasenhac.com/down2/2230/0/2229564-d379b916/128/Chim%20Sau%20-%20MCK_%20Trung%20Tran.mp3'
        },
        {
            name: 'Anh Đã Lạc Vào',
            singer: 'Green; Đại Mèo',
            image: 'https://data.chiasenhac.com/data/cover/157/156870.jpg',
            path: 'https://data.chiasenhac.com/down2/2230/0/2229102-d7c7ef68/128/Anh%20Da%20Lac%20Vao%20Dai%20Meo%20Remix_%20-%20Green_%20D.mp3'
        },
        {
            name: 'Hoa tàn tình tan',
            singer: 'Giang Jolee',
            image: 'https://data.chiasenhac.com/data/cover/154/153415.jpg',
            path: 'https://data.chiasenhac.com/down2/2219/0/2218836-c7b66003/128/Hoa%20Tan%20Tinh%20Tan%20Haozi%20Remix_%20-%20Giang%20Jo.mp3'
        },
        {
            name: 'Thay mọi cô gái yêu anh',
            singer: 'AMee',
            image: 'https://data.chiasenhac.com/data/cover/155/154598.jpg',
            path: 'https://data.chiasenhac.com/down2/2223/0/2222497-0cc9e994/128/Thay%20Moi%20Co%20Gai%20Yeu%20Anh%20-%20AMee.mp3'
        },
        {
            name: 'Chỉ muốn bên em thật gần',
            singer: 'YLing; Star Online',
            image: 'https://data.chiasenhac.com/data/cover/156/155301.jpg',
            path: 'https://data.chiasenhac.com/down2/2225/0/2224980-e7f62e1c/128/Chi%20Muon%20Ben%20Em%20That%20Gan%20-%20YLing_%20Star%20O.mp3'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            image: 'https://data.chiasenhac.com/data/cover/156/155099.jpg',
            path: 'https://data.chiasenhac.com/down2/2225/0/2224332-7bf4caf7/128/Chay%20Ve%20Noi%20Phia%20Anh%20-%20Khac%20Viet.mp3'
        },
        {
            name: 'Tình đơn côi',
            singer: 'Vicky Nhung; Long Rex',
            image: 'https://data.chiasenhac.com/data/cover/158/157112.jpg',
            path: 'https://data.chiasenhac.com/down2/2230/0/2229752-0d0e7dff/128/Tinh%20Don%20Coi%20Lofi%20Version_%20-%20Vicky%20Nhung.mp3'
        },
        {
            name: 'Yêu đương khó quá thì chạy về khóc với anh',
            singer: 'Erik',
            image: 'https://data.chiasenhac.com/data/cover/155/154074.jpg',
            path: 'https://data.chiasenhac.com/down2/2221/0/2220891-72ab7211/128/Yeu%20Duong%20Kho%20Qua%20Thi%20Chay%20Ve%20Khoc%20Voi%20A.mp3'
        },
        {
            name: 'Đừng khiến trái tim em khóc',
            singer: 'Chu Thúy Quỳnh; Trung Ngon',
            image: 'https://data.chiasenhac.com/data/cover/154/153696.jpg',
            path: 'https://data.chiasenhac.com/down2/2220/0/2219893-69b08713/128/Dung%20Khien%20Trai%20Tim%20Em%20Khoc%20-%20Chu%20Thuy%20Q.mp3'
        },
        {
            name: 'Cổ tích',
            singer: 'JSOL',
            image: 'https://data.chiasenhac.com/data/cover/157/156805.jpg',
            path: 'https://data.chiasenhac.com/down2/2229/0/2228955-bf5921bd/128/Co%20Tich%20-%20JSOL.mp3'
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
                alert('Vì lý do bản quyền, toàn bộ link nhạc đã bị die');
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
            alert('Vì lý do bản quyền, toàn bộ link nhạc đã bị die');
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
            alert('Vì lý do bản quyền, toàn bộ link nhạc đã bị die');
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
        alert('Vì lý do bản quyền, toàn bộ link nhạc đã bị die');
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