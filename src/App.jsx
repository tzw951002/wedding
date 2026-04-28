import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas'
import './App.css'
import weddingPhoto from './assets/wedding.jpg'
import pikaImg from './assets/pika_no_bg.png'
import mapImg from './assets/map.png'
import backMp3 from './assets/back.mp3'
import lotteryNamesRaw from './lottery-names.md?raw'

/* ============================================
   Wedding Invitation Data (中文)
   ============================================ */
const WEDDING = {
  groomName: '陶郑伟',
  brideName: '徐婷',
  welcomeLines: [
    '诚邀您来见证与分享',
    '我们此刻最大的幸福与喜悦',
    '',
    '我们希望借用这场不算盛大却足够用心的仪式',
    '来记录这一场关于爱的新启程',
  ],
  date: '2026年5月3日 星期日',
  lunarDate: '农历三月十七',
  time: '15:30',
  address: '上海市长宁区虹桥路1970号',
  venueName: '晶浦会·现代潮粤菜(虹桥路店)',
  mapUrl: 'https://map.baidu.com/poi/%E6%99%B6%E6%B5%A6%E4%BC%9A%C2%B7%E7%8E%B0%E4%BB%A3%E6%BD%AE%E7%B2%A4%E8%8F%9C(%E8%99%B9%E6%A1%A5%E8%B7%AF%E5%BA%97)/@13513404.64030626,3636829.5052368464,16.98z?uid=c61bd3057d430171c27da25c&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&sn_xy=15562860.799912611,4243099.786009105&en_uid=c61bd3057d430171c27da25c&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl',
  timeline: [
    { label: '宾客签到', time: '15:30' },
    { label: '宾客合影', time: '16:00' },
    { label: '草坪仪式', time: '16:18' },
    { label: '晚宴仪式', time: '18:18' },
  ],
  tips: [
    '1. 如果你身在不同的城市或因繁忙的工作无法到达现场没有关系，我们已经收到祝福~',
    '2. 如果你有时间，请准备好你的好心情和好胃口，开开心心地来赴约吧~',
    '3. 婚礼有专业的摄影，欢迎大家积极与我们合影哦~',
  ],
  blessingLines: [
    '就决定是你了！',
    '好久不见，期待在我们的\'联盟盛典\'见。',
  ],
  initials: 'T & X',
  photoUrl: weddingPhoto,
}

/* ============================================
   Wedding Invitation Data (日本語)
   ============================================ */
const WEDDING_JP = {
  groomName: '陶鄭偉',
  brideName: '徐婷',
  welcomeLines: [
    '私たちの幸せの瞬間を',
    'ぜひご一緒にご覧ください',
    '',
    'ささやかでも心を込めた式で',
    '愛という新しい旅立ちを刻みたく存じます',
  ],
  date: '2026年5月3日（日）',
  lunarDate: '旧暦三月十七日',
  time: '15:30',
  address: '上海市長寧区虹橋路1970号',
  venueName: '晶浦会・現代潮粤菜（虹橋路店）',
  mapUrl: 'https://map.baidu.com/poi/%E6%99%B6%E6%B5%A6%E4%BC%9A%C2%B7%E7%8E%B0%E4%BB%A3%E6%BD%AE%E7%B2%A4%E8%8F%9C(%E8%99%B9%E6%A1%A5%E8%B7%AF%E5%BA%97)/@13513404.64030626,3636829.5052368464,16.98z?uid=c61bd3057d430171c27da25c&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&sn_xy=15562860.799912611,4243099.786009105&en_uid=c61bd3057d430171c27da25c&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl',
  timeline: [
    { label: '受付', time: '15:30' },
    { label: '記念撮影', time: '16:00' },
    { label: '芝生セレモニー', time: '16:18' },
    { label: '披露宴', time: '18:18' },
  ],
  tips: [
    '1. 遠方やお仕事の都合でご出席が難しい場合でも、お気持ちだけでも嬉しく存じます。',
    '2. お越しいただける方は、どうぞお気軽に、お腹も心も満たされるようお越しください。',
    '3. プロのカメラマンがおりますので、ぜひ一緒に記念撮影をお楽しみください。',
  ],
  blessingLines: [
    '君に決めた！',
    '久しぶり、私たちの「リーグ祭典」でお会いしましょう。',
  ],
  initials: 'T & X',
  photoUrl: weddingPhoto,
}

/* ============================================
   UI 文案 (中文 / 日本語)
   ============================================ */
const TEXTS = {
  unlockHint: '输入密码，开启邀请函',
  unlockPlaceholder: '请输入密码',
  unlockBtn: '开启',
  unlockError: '密码错误，请重试',
  headerTitle: 'Wedding Invitation',
  headerSubtitle: '婚礼邀请函',
  headerHi: 'Hi',
  welcomeTitle: 'Welcome to our wedding',
  sectionTime: 'Wedding Time',
  sectionAddress: 'Wedding Address',
  mapOpen: '点击打开百度地图',
  mapOpenTitle: '打开百度地图',
  sectionProcess: 'Wedding Process',
  sectionTips: 'Tips',
  gameTitle: '寻找"隐藏款"宝可梦',
  gameDesc1: '在邀请函里藏着几只皮卡丘，试着在页脚、文字旁、图片边缘找找看。',
  gameDesc2: '点满 5 个隐藏图标后，会弹出数字伴手礼提示哦～',
  giftTitle: '恭喜找齐了所有皮卡丘',
  giftSubtitle: '来场特典',
  giftBody: '当日来场人员凭截图可以一人领取一次特别奖励！',
  giftClose: '收下啦',
  giftDownloadName: '来场特典.png',
}

const TEXTS_JP = {
  unlockHint: 'パスワードを入力して招待状を開く',
  unlockPlaceholder: 'パスワードを入力',
  unlockBtn: '開く',
  unlockError: 'パスワードが違います。もう一度お試しください',
  headerTitle: 'Wedding Invitation',
  headerSubtitle: '結婚招待状',
  headerHi: 'Hi',
  welcomeTitle: '私たちの結婚式へようこそ',
  sectionTime: '日時',
  sectionAddress: '会場',
  mapOpen: '百度地図で開く',
  mapOpenTitle: '百度地図を開く',
  sectionProcess: '式の流れ',
  sectionTips: 'ご案内',
  gameTitle: '「隠しピカチュウ」を探そう',
  gameDesc1: '招待状のあちこちにピカチュウが隠れています。フッターや文字のまわり、写真の端を探してみてね。',
  gameDesc2: '5つ全部見つけると、来場特典の案内が表示されます。',
  giftTitle: 'ピカチュウを全部見つけました！',
  giftSubtitle: '来場特典',
  giftBody: '当日ご来場の方は、この画面のスクリーンショットをご提示いただくと、特典を1人1回お受け取りいただけます。',
  giftClose: '受け取る',
  giftDownloadName: '来場特典.png',
}

/* ============================================
   Pokeball SVG Component
   ============================================ */
function Pokeball({ opened }) {
  return (
    <svg
      className={`pokeball-svg ${opened ? 'opened' : ''}`}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 上半部分（红色）*/}
      <g className="pokeball-top">
        <path
          d="M100 100 L100 100 A90 90 0 0 1 10 100 L190 100 A90 90 0 0 1 100 10 Z"
          fill="#EE1515"
          stroke="#222"
          strokeWidth="4"
        />
        <path
          d="M10 100 A90 90 0 0 1 100 10 A90 90 0 0 1 190 100 Z"
          fill="#EE1515"
          stroke="#222"
          strokeWidth="4"
        />
      </g>
      {/* 下半部分（白色）*/}
      <g className="pokeball-bottom">
        <path
          d="M10 100 A90 90 0 0 0 190 100 Z"
          fill="#fff"
          stroke="#222"
          strokeWidth="4"
        />
      </g>
      {/* 中间横线 */}
      <line x1="10" y1="100" x2="70" y2="100" stroke="#222" strokeWidth="4" />
      <line x1="130" y1="100" x2="190" y2="100" stroke="#222" strokeWidth="4" />
      {/* 中心按钮 */}
      <circle cx="100" cy="100" r="30" fill="#fff" stroke="#222" strokeWidth="4" />
      <circle className="pokeball-button" cx="100" cy="100" r="18" fill="#fff" stroke="#222" strokeWidth="3" />
    </svg>
  )
}

/* 隐藏款图标：使用 pika.png，尺寸由 CSS 控制 */
function HiddenEggImg() {
  return <img src={pikaImg} alt="" className="hidden-egg-img" />
}

/* ============================================
   Sparkle particles for flash effect
   ============================================ */
function Sparkles() {
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360
    const distance = 60 + Math.random() * 100
    const size = 4 + Math.random() * 8
    const delay = Math.random() * 0.3
    return { angle, distance, size, delay, id: i }
  })

  return (
    <div className="sparkles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle"
          style={{
            '--angle': `${p.angle}deg`,
            '--distance': `${p.distance}px`,
            '--size': `${p.size}px`,
            '--delay': `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ============================================
   Main App
   ============================================ */
const UNLOCK_PASSWORD = '20260503'
const LOTTERY_PASSWORD = '8021'
const LOTTERY_UNLOCK_KEY = 'weddingLotteryUnlockedAt'

function isLotteryUnlocked() {
  const unlockedAt = Number(window.localStorage.getItem(LOTTERY_UNLOCK_KEY))
  return Number.isFinite(unlockedAt) && Date.now() - unlockedAt < 1000 * 60 * 60 * 6
}

function unlockLottery() {
  window.localStorage.setItem(LOTTERY_UNLOCK_KEY, String(Date.now()))
}

function parseLotteryNames(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter((line) => line && !line.startsWith('#'))
}

function LotteryPage() {
  const names = useMemo(() => parseLotteryNames(lotteryNamesRaw), [])
  const prizeRounds = useMemo(() => {
    const thirdPrizePool = names.slice(2)
    const thirdPrizeName = thirdPrizePool.length > 0
      ? thirdPrizePool[Math.floor(Math.random() * thirdPrizePool.length)]
      : names[0]

    return [
      { label: '三等奖', name: thirdPrizeName },
      { label: '二等奖', name: names[1] },
      { label: '一等奖', name: names[0] },
    ].filter((round) => round.name)
  }, [names])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRolling, setIsRolling] = useState(true)
  const [roundIndex, setRoundIndex] = useState(0)
  const [selectedName, setSelectedName] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(() => isLotteryUnlocked())
  const [lotteryPasswordInput, setLotteryPasswordInput] = useState('')
  const [lotteryPasswordError, setLotteryPasswordError] = useState('')
  const currentRound = prizeRounds[roundIndex] ?? { label: '抽奖', name: names[0] }
  const currentName = selectedName || names[currentIndex] || '等待名单'

  useEffect(() => {
    document.documentElement.lang = 'zh-CN'
    document.title = '现场幸运抽奖 | Wedding Live Draw'
  }, [])

  useEffect(() => {
    if (!isRolling || names.length === 0) return undefined

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % names.length)
    }, 70)

    return () => window.clearInterval(timer)
  }, [isRolling, names.length])

  const handleLotteryControl = useCallback(() => {
    if (prizeRounds.length === 0) return

    if (isRolling) {
      const targetName = currentRound.name
      const targetIndex = names.indexOf(targetName)
      if (targetIndex >= 0) {
        setCurrentIndex(targetIndex)
      }
      setSelectedName(targetName)
      setIsRolling(false)
      return
    }

    if (roundIndex >= prizeRounds.length - 1) {
      setRoundIndex(0)
    } else {
      setRoundIndex((index) => index + 1)
    }
    setSelectedName('')
    setIsRolling(true)
  }, [currentRound.name, isRolling, names, prizeRounds.length, roundIndex])

  useEffect(() => {
    if (!isAuthorized) return undefined

    const handleKeyDown = (event) => {
      const targetTag = event.target?.tagName
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      handleLotteryControl()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleLotteryControl, isAuthorized])

  const handleCloseLottery = () => {
    window.close()
    window.setTimeout(() => {
      if (!window.closed) {
        window.alert('如果浏览器没有自动关闭，请直接关闭这个抽奖窗口。')
      }
    }, 120)
  }

  const handleLotteryPasswordSubmit = (event) => {
    event.preventDefault()
    if (lotteryPasswordInput.trim() !== LOTTERY_PASSWORD) {
      setLotteryPasswordError('密码错误，请重试。')
      return
    }

    unlockLottery()
    setIsAuthorized(true)
    setLotteryPasswordError('')
  }

  return (
    <div className="lottery-page">
      <div className="lottery-bg-pokeballs" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="lottery-bg-pokeball"
            style={{ '--i': i, '--x': `${(i * 17) % 96}%`, '--y': `${(i * 29) % 92}%` }}
          />
        ))}
      </div>

      <button type="button" className="lottery-back-link" onClick={handleCloseLottery}>
        关闭抽奖窗口
      </button>

      {!isAuthorized ? (
        <main className="lottery-panel lottery-password-panel">
          <div className="lottery-kicker">Wedding Live Draw</div>
          <h1 className="lottery-title">现场抽奖入口</h1>
          <p className="lottery-subtitle">请输入密码开启抽奖页面</p>
          <form className="lottery-password-form" onSubmit={handleLotteryPasswordSubmit}>
            <input
              type="password"
              className="lottery-password-input"
              value={lotteryPasswordInput}
              onChange={(event) => {
                setLotteryPasswordInput(event.target.value)
                setLotteryPasswordError('')
              }}
              placeholder="请输入密码"
              autoFocus
            />
            <button type="submit" className="lottery-password-button">
              开启抽奖
            </button>
          </form>
          {lotteryPasswordError && (
            <div className="lottery-password-error">{lotteryPasswordError}</div>
          )}
        </main>
      ) : (
      <main className="lottery-panel">
        <div className="lottery-kicker">Wedding Live Draw</div>
        <h1 className="lottery-title">现场幸运抽奖</h1>
        <p className="lottery-subtitle">依次抽出三等奖、二等奖、一等奖</p>
        <div className="lottery-prize">{currentRound.label}</div>

        <div className={`lottery-stage ${isRolling ? 'is-rolling' : 'is-paused'}`}>
          <div className="lottery-pika-card">
            <img src={pikaImg} alt="" className="lottery-pika" />
          </div>
          <div className="lottery-name-window">
            <div className="lottery-name">{currentName}</div>
          </div>
          {!isRolling && (
            <div className="lottery-winner">
              {currentRound.label}：{currentName}
            </div>
          )}
        </div>

        <button
          type="button"
          className={`lottery-control ${isRolling ? '' : 'is-paused'}`}
          onClick={handleLotteryControl}
        >
          {isRolling
            ? `暂停！抽出${currentRound.label}`
            : roundIndex >= prizeRounds.length - 1
              ? '重新开始抽奖'
              : `开始${prizeRounds[roundIndex + 1]?.label ?? '下一轮'}`}
        </button>

        <div className="lottery-tip">也可以按空格键或 Enter 键暂停/继续</div>
      </main>
      )}
    </div>
  )
}

function InvitationPage({ isJp }) {
  const w = isJp ? WEDDING_JP : WEDDING
  const t = isJp ? TEXTS_JP : TEXTS

  const [phase, setPhase] = useState('idle') // idle -> opening -> flash -> revealed
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleOpen = () => {
    if (phase !== 'idle') return
    setPhase('opening')
    setTimeout(() => setPhase('flash'), 600)
    setTimeout(() => setPhase('revealed'), 1600)
  }

  const handleUnlockSubmit = (e) => {
    e.preventDefault()
    setPasswordError('')
    const value = passwordInput.trim()
    if (value === UNLOCK_PASSWORD) {
      handleOpen()
    } else {
      setPasswordError(t.unlockError)
    }
  }

  const handleLotteryEntryClick = () => {
    const value = window.prompt('请输入现场抽奖密码')
    if (value !== LOTTERY_PASSWORD) {
      window.alert('密码错误，暂时不能打开抽奖页面。')
      return
    }

    unlockLottery()
    const lotteryWindow = window.open('/lottery', 'wedding-lottery', 'popup,width=1400,height=900')
    if (!lotteryWindow) {
      window.alert('浏览器拦截了新窗口，请允许弹窗后再试。')
    }
  }

  const [foundEggs, setFoundEggs] = useState(() => new Set())
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)

  const bgmRef = useRef(null)
  if (!bgmRef.current) {
    bgmRef.current = new Audio(backMp3)
    bgmRef.current.loop = false
  }

  useEffect(() => {
    if (phase === 'revealed') {
      const bgm = bgmRef.current
      bgm.currentTime = 0
      bgm.play().catch(() => {})
    }
  }, [phase])

  useEffect(() => {
    document.documentElement.lang = isJp ? 'ja' : 'zh-CN'
    document.title = isJp ? '結婚招待状 | Wedding Invitation' : '婚礼邀请函 | Wedding Invitation'
  }, [isJp])

  const giftModalRef = useRef(null)

  const totalEggs = 5
  const handleEggClick = (id) => {
    if (foundEggs.has(id)) return
    const next = new Set(foundEggs)
    next.add(id)
    setFoundEggs(next)
    if (next.size >= totalEggs) {
      setConfettiKey((k) => k + 1)
      setShowGiftModal(true)
    }
  }

  const handleGiftClose = () => {
    if (!giftModalRef.current) {
      setShowGiftModal(false)
      return
    }
    html2canvas(giftModalRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
    })
      .then((canvas) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            setShowGiftModal(false)
            return
          }
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = t.giftDownloadName
          a.click()
          URL.revokeObjectURL(url)
        }, 'image/png')
      })
      .catch(() => {})
      .finally(() => {
        setShowGiftModal(false)
      })
  }

  return (
    <div className="app-wrapper">
      {/* ======== 精灵球开场页 ======== */}
      {phase !== 'revealed' && (
        <div className={`pokeball-screen ${phase}`}>
          {/* 背景浮动精灵球装饰 */}
          <div className="bg-pokeballs">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-pokeball" style={{ '--i': i }} />
            ))}
          </div>

          <div className="pokeball-container">
            <Pokeball opened={phase === 'opening' || phase === 'flash'} />
            {(phase === 'flash') && <Sparkles />}
          </div>

          {phase === 'idle' && (
            <div className="pokeball-unlock" onClick={(e) => e.stopPropagation()}>
              <div className="pokeball-hint">
                <span className="hint-text">{t.unlockHint}</span>
                <div className="hint-bounce">▼</div>
              </div>
              <form className="unlock-form" onSubmit={handleUnlockSubmit}>
                <div className="unlock-input-wrap">
                  <input
                    type="password"
                    className="unlock-input"
                    placeholder={t.unlockPlaceholder}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value)
                      setPasswordError('')
                    }}
                    maxLength={20}
                    autoComplete="off"
                  />
<button type="submit" className="unlock-btn">
                {t.unlockBtn}
              </button>
                </div>
                {passwordError && (
                  <p className="unlock-error">{passwordError}</p>
                )}
              </form>
            </div>
          )}

          {/* 闪光遮罩 */}
          {phase === 'flash' && <div className="flash-overlay" />}
        </div>
      )}

      {/* ======== 数字伴手礼弹窗 + 皮卡丘撒花 ======== */}
      {showGiftModal && (
        <>
          <div className="confetti-layer" key={confettiKey}>
            {Array.from({ length: 48 }, (_, i) => {
              const angle = (i / 48) * 360 + Math.random() * 20
              const dist = 80 + Math.random() * 200
              const tx = Math.cos((angle * Math.PI) / 180) * dist + (Math.random() - 0.5) * 80
              const ty = Math.sin((angle * Math.PI) / 180) * dist + (Math.random() - 0.5) * 80
              const colors = ['yellow', 'red', 'orange']
              return (
                <div
                  key={i}
                  className={`confetti-piece ${colors[i % 3]}`}
                  style={{
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                  }}
                />
              )
            })}
          </div>
          <div className="gift-modal-overlay" onClick={() => setShowGiftModal(false)}>
            <div ref={giftModalRef} className="gift-modal" onClick={(e) => e.stopPropagation()}>
              <div className="gift-modal-title">🎉 {t.giftTitle}</div>
              <div className="gift-modal-subtitle">{t.giftSubtitle}</div>
              <div className="gift-modal-address">
                {t.giftBody}
              </div>
              <button type="button" className="gift-modal-close" onClick={handleGiftClose}>
                {t.giftClose}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ======== 请柬内容 ======== */}
      {/* 樱花飘落层（仅请柬页显示）*/}
      {phase === 'revealed' && (
        <div className="sakura-layer" aria-hidden>
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              className="sakura-petal"
              style={{
                '--delay': `${Math.random() * 5}s`,
                '--x': `${Math.random() * 100}vw`,
                '--duration': `${12 + Math.random() * 8}s`,
                '--sway': `${(Math.random() - 0.5) * 80}px`,
              }}
            />
          ))}
        </div>
      )}

      {phase === 'revealed' && (
        <div className="invitation pokemon-theme fade-in">
          <header className="header">
            {/* 隐藏彩蛋 1 - 左上角 */}
            <button
              type="button"
              className={`hidden-egg ${foundEggs.has(0) ? 'found' : ''}`}
              style={{ top: 12, left: 16 }}
              onClick={() => handleEggClick(0)}
              aria-label="隐藏彩蛋"
            >
              <HiddenEggImg />
            </button>
            <div className="header-badge">
              <div className="mini-pokeball" />
            </div>
            <div className="header-title">{t.headerTitle}</div>
            <div className="header-subtitle">{t.headerSubtitle}</div>
            <div className="header-hi">{t.headerHi}</div>
          </header>

          {/* 欢迎词 */}
          <section className="welcome-section">
            {/* 隐藏彩蛋 3 - 欢迎区右侧 */}
            <button
              type="button"
              className={`hidden-egg ${foundEggs.has(2) ? 'found' : ''}`}
              style={{ top: 20, right: 20 }}
              onClick={() => handleEggClick(2)}
              aria-label="隐藏彩蛋"
            >
              <HiddenEggImg />
            </button>
            <div className="welcome-title">{t.welcomeTitle}</div>
            <div className="welcome-text">
              {w.welcomeLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < w.welcomeLines.length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="couple-names">
              <span>{w.groomName}</span>
              <span className="heart-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#EE1515">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </span>
              <span>{w.brideName}</span>
            </div>
          </section>

          <div className="section-divider">
            <div className="divider-pokeball" />
          </div>

          {/* 婚纱照 - 放在 Wedding Time 上方 */}
          <section className="photo-section">
            <div className="photo-frame">
              <img src={w.photoUrl} alt="Wedding Photo" />
              {/* 隐藏彩蛋 2 - 照片右下角 */}
              <button
                type="button"
                className={`hidden-egg ${foundEggs.has(1) ? 'found' : ''}`}
                style={{ bottom: 8, right: 8 }}
                onClick={() => handleEggClick(1)}
                aria-label="隐藏彩蛋"
              >
                <HiddenEggImg />
              </button>
            </div>
          </section>

          {/* 婚礼时间 */}
          <section className="info-section">
            <div className="section-title">{t.sectionTime}</div>
            <div className="info-text">
              {w.date}
              <br />
              <span className="lunar">{w.lunarDate}</span> {w.time}
            </div>
          </section>

          {/* 婚礼地点 */}
          <section className="info-section">
            <div className="section-title">{t.sectionAddress}</div>
            <div className="info-venue">{w.venueName}</div>
            <div className="info-text">{w.address}</div>
            <a
              className="map-wrap"
              href={w.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={t.mapOpenTitle}
            >
              <img src={mapImg} alt="" className="map-img" />
              <span className="map-open-baidu">{t.mapOpen}</span>
            </a>
          </section>

          {/* 婚礼流程 */}
          <section className="process-section">
            <div className="section-title">{t.sectionProcess}</div>
            <div className="process-timeline">
              {w.timeline.map((item, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-pokeball-dot" />
                  <div className="timeline-line">
                    <div className="timeline-dots" />
                  </div>
                  <span className="timeline-label">{item.label}</span>
                  <span className="timeline-time">{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="section-divider">
            <div className="divider-pokeball" />
          </div>

          {/* 温馨提示 */}
          <section className="tips-section">
            {/* 隐藏彩蛋 4 - 文字边缘 */}
            <button
              type="button"
              className={`hidden-egg ${foundEggs.has(3) ? 'found' : ''}`}
              style={{ bottom: 24, left: 20 }}
              onClick={() => handleEggClick(3)}
              aria-label="隐藏彩蛋"
            >
              <HiddenEggImg />
            </button>
            <div className="tips-title">{t.sectionTips}</div>
            <ul className="tips-list">
              {w.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>

          <div className="section-divider">
            <div className="divider-pokeball" />
          </div>

          {/* 游戏说明（最后一个模块）*/}
          <section className="game-section">
            <div className="game-title">寻找“隐藏款”宝可梦</div>
            <div className="game-desc">
              {t.gameDesc1}
              <br />
              {t.gameDesc2}
            </div>
          </section>

          {/* 页脚 */}
          <footer className="footer">
            {/* 隐藏彩蛋 5 - 页脚 */}
            <button
              type="button"
              className={`hidden-egg ${foundEggs.has(4) ? 'found' : ''}`}
              style={{ top: 8, right: 24 }}
              onClick={() => handleEggClick(4)}
              aria-label="隐藏彩蛋"
            >
              <HiddenEggImg />
            </button>
            <div className="footer-pokeballs">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="footer-mini-pokeball" />
              ))}
            </div>
            <div className="footer-blessing">
              {w.blessingLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < w.blessingLines.length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="footer-initials">{w.initials}</div>
            <button type="button" className="lottery-entry" onClick={handleLotteryEntryClick}>
              <span className="lottery-entry-ball" />
              <span>
                <strong>现场幸运抽奖</strong>
                <small>Wedding Live Draw</small>
              </span>
            </button>
          </footer>
        </div>
      )}
    </div>
  )
}

function App() {
  const location = useLocation()
  const isLottery = location.pathname === '/lottery' || location.pathname === '/lottery/'
  const isJp = location.pathname === '/jp' || location.pathname === '/jp/'

  if (isLottery) {
    return <LotteryPage />
  }

  return <InvitationPage isJp={isJp} />
}

export default App
