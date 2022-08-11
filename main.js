let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)
let picture = $('.picture')
let title = $('.iplay h1')
let author = $('.iplay p')
let progress = $('.progress-bar')
let time1 = $('.timer .begin')
let time2 = $('.timer .end')
let openList = $('#openlist')
let audio = $('.audio')
let prev = $('#prev')
let playPause = $('#play-pause')
let next = $('#next')
let songFlow = $('#song-flow')
let playList = $('.playlist')
let iBtn = $$('.material-symbols-rounded')
let body = $('body')

const app = {
    songs: [
        {
            title:'Yêu Giang Sơn Càng Yêu Mỹ Nhân',
            author:'Tiểu A Phong',
            path:'music2/01.mp3',
            image:'image2/01.jpg',
        },
        {
            title:'Melody Of The Night',
            author:'Jin Shi',
            path:'music2/02.mp3',
            image:'image2/02.jpg',
        },
        {
            title:'Tiktok Music',
            author:'V.A',
            path:'music2/03.mp3',
            image:'image2/03.jpg',
        },
        {
            title:'Star Sky',
            author:'Two Steps From Hell',
            path:'music2/04.mp3',
            image:'image2/04.jpg',
        },
        {
            title:'Silent Open OST',
            author:'Cagnet',
            path:'music2/05.mp3',
            image:'image2/05.jpg',
        },
        {
            title:'Windy Hill',
            author:'V.A',
            path:'music2/06.mp3',
            image:'image2/06.jpg',
        },
        {
            title:'Khởi Hành',
            author:'V.A',
            path:'music2/07.mp3',
            image:'image2/07.jpg',
        },
    ],
    currentIndex: 0,
    flowIndex: 0,
    isProgress: false,
    isPlayList: false,
    arrRandom: [],

    sonlasi: `
            <span class = 'sonlasi'></span>
            <span class = 'sonlasi'></span>
            <span class = 'sonlasi'></span>
            <span class = 'sonlasi'></span>
            <span class = 'sonlasi'></span>
            `,

    timeFormat(time) {
        let min = Math.floor(time/60)
        min = min >= 10 ? min : '0'+ min
        let sec = Math.floor(time%60)
        sec = sec >= 10 ? sec : '0' + sec
        return `${min}:${sec}`

    },

    playList() {
        playList.innerHTML = this.songs.map((i,j)=>{
            return `
            <div class = 'song'>
                <div class = 'thumb' style = 'background-image: url(${i.image})'></div>
                <div class = 'body'>
                    <h3>${i.title}</h3>
                    <p>${i.author}</p>
                </div>
                <div class = 'lala'></div>
                <audio class = 'listAudio' src = '${i.path}'></audio>
            </div>
            `
        }).join('')

        $$('.listAudio').forEach((i,j)=>{
            i.onloadedmetadata=f=>{
                $$('.lala')[j].innerHTML = 
                j==this.currentIndex ? this.sonlasi : this.timeFormat(i.duration)
            }
        })

    },

    currentSong() {
        let iCurrentSong = this.songs[this.currentIndex]
        title.innerText = iCurrentSong.title
        author.innerText = iCurrentSong.author
        picture.style.backgroundImage = `url('${iCurrentSong.image}')`
        audio.src = iCurrentSong.path
     //   iBtn.forEach(f=>{
     //       f.style.backgroundImage = `url('${iCurrentSong.image}')`
     //   })
    },

    setSong(iNew) {
        $$('.lala')[this.currentIndex].innerText = 
        this.timeFormat($$('.listAudio')[this.currentIndex].duration)
        this.currentIndex = iNew
        $$('.lala')[iNew].innerHTML = this.sonlasi
        this.currentSong()
        audio.play()
    },

    ranDom() {
        let newIndex
        if(this.arrRandom.length == this.songs.length) { this.arrRandom = [] }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.arrRandom.includes(newIndex))
        this.arrRandom.push(newIndex)
        this.setSong(newIndex)
    },

    listenEvent() {

        let animate = picture.animate({transform: 'rotate(360deg)'},{
            duration: 10000,
            iterations: Infinity

        })

        animate.pause()

        playPause.onclick = f=> {
            audio.paused ? audio.play() : audio.pause() 
        }

        audio.onplay = f=> {
            playPause.innerText = 'pause_circle'
            animate.play()
            this.scrollActive()
        }

        audio.onpause = f=> {
            playPause.innerText = 'play_circle'
            animate.pause()
        }

        audio.onended = f=> {
            if(this.flowIndex===1) {
                audio.play()
            } else {
                next.click()            
            }
                  
        }

        audio.ontimeupdate = f=> {
            time1.innerText = this.timeFormat(audio.currentTime)
            $('.progress').style.width = audio.currentTime/audio.duration*100 + '%'
        }

        audio.onloadedmetadata = f=> {
            time2.innerText = this.timeFormat(audio.duration)
        }

        next.onclick = f=> {
            if(this.flowIndex==2) { 
                this.ranDom() 
            } else {
                this.setSong((this.currentIndex + 1)% this.songs.length)
            }          
        }

        prev.onclick = f=> {
            if(this.flowIndex==2) {
                 this.ranDom() 
            } else {
                this.setSong((this.currentIndex - 1) ==-1 ? (this.songs.length-1) : this.currentIndex-1)
            }       
        }

        songFlow.onclick = f=> {
            this.flowIndex = this.flowIndex + 1 == 3 ? 0 : this.flowIndex + 1
            if(this.flowIndex===1) {
                songFlow.innerText = 'repeat_one'
            
            }
            else if(this.flowIndex===2) {
                songFlow.innerText= 'shuffle'
              
            }
            else {
                songFlow.innerText = 'repeat'
               
            }
   
        }

        openList.onclick =f=>{
            playList.style.height =
            playList.style.height=='75%' ? 0 : '75%'
           // $('.control').classList.toggle('active')
            $('.fplay').classList.toggle('active')           
        }


        $$('.song').forEach((i,j) => {
            i.onclick = f=> {
                this.setSong(j)               
            }
        
        })

        progress.onmousedown = f=> {
            this.isProgress = true
            audio.currentTime = f.offsetX/f.target.offsetWidth*audio.duration
        }

        progress.onmousemove = f=> {
            if(this.isProgress)
            audio.currentTime = f.offsetX/f.target.offsetWidth*audio.duration
        }

        window.onmouseup = f=> {
            this.isProgress = false
        }

        // Accessibility improvement with keydown events on space bar & arrow keys
        window.onkeydown = (e) => {
        switch (e.keyCode) {
           case 32:
              e.preventDefault();
              playPause.click();
              break;
           case 37:
              e.preventDefault();
              audio.currentTime-=5;
              break;
           case 38:
              e.preventDefault();
              audio.volume+0.05 < 1 ? audio.volume+=0.05 : audio.volume = 1;
              break;
           case 39:
              e.preventDefault();
              audio.currentTime+=5;
              break;
           case 40:
              e.preventDefault();
              audio.volume-0.05 > 0 ? audio.volume-=0.05 : audio.volume = 0;
              break;
        }
     }
       
    },

    scrollActive() {    
        if(this.currentIndex<4){
            $$('.song')[this.currentIndex].scrollIntoView(false)
       } else{
            $$('.song')[this.currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
        })
        }
    },
 

    start() {
        this.playList()
        this.currentSong()
        this.listenEvent()
    }

}

app.start()
