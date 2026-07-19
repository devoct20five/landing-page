'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Check, Clock, CalendarClock, Globe, ChevronLeft, ChevronRight, Mail, ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'

const REACHING = ['Individual/Creator', 'Brand/Business', 'Agency/Studio', 'Other']
const TOPICS = ['New Project', 'Retainer', 'Editing', 'Design', '3D Ads', 'Web Dev', 'Partnership', 'Not Sure Yet']
const TIMES = ['10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '14:00', '14:20', '14:40', '15:00', '15:20', '15:40', '16:00', '16:20', '16:40', '17:00']

function buildMonth(base) {
  const year = base.getFullYear()
  const month = base.getMonth()
  const first = new Date(year, month, 1)
  const startDay = first.getDay() // 0 sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < startDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
  return { year, month, days }
}

export default function BookACallPage() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState({
    role: 'Brand/Business',
    name: '',
    email: '',
    topic: 'New Project',
    project: '',
    date: null,
    time: null,
  })
  const [confirmed, setConfirmed] = useState(false)
  const [monthCursor, setMonthCursor] = useState(new Date())
  const monthData = useMemo(() => buildMonth(monthCursor), [monthCursor])
  const today = new Date(); today.setHours(0,0,0,0)

  const setField = (k, v) => setState((s) => ({ ...s, [k]: v }))

  const canGoStep2 = state.name && state.email && state.role && state.topic

  const monthLabel = monthCursor.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const nextMonth = () => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))
  const prevMonth = () => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))

  return (
    <>
      <Navbar variant="utility" initialTheme="light" />
      <main>
        <SectionWrapper theme="light" className="!pt-40 !pb-20">
          <div className="container">
            <AnimatePresence mode="wait">
              {!confirmed && step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                  <StepHeader step={1} label="Your details" />
                  <div className="grid lg:grid-cols-12 gap-10 mt-8">
                    <div className="lg:col-span-5">
                      <h1 className="font-display uppercase leading-[0.9] tracking-tight text-display-xl text-balance">
                        First, tell us <br /> a little <span className="text-brand-orange">about</span> you.
                      </h1>
                      <p className="mt-6 text-body-lg opacity-75 max-w-md">Just enough context so we know who we&rsquo;re talking to and what you&rsquo;d like to discuss.</p>

                      <div className="mt-10 space-y-3">
                        <div className="brand-card !p-5">
                          <p className="eyebrow"><span className="eyebrow-dot" /> 20 minutes</p>
                          <p className="mt-3 opacity-80 text-sm">A focused, no-pressure conversation.</p>
                        </div>
                        <div className="brand-card !p-5">
                          <p className="eyebrow"><span className="eyebrow-dot" /> Video call</p>
                          <p className="mt-3 opacity-80 text-sm">Google Meet or Zoom.</p>
                        </div>
                        <div className="brand-card !p-5">
                          <p className="eyebrow"><span className="eyebrow-dot" /> No commitment</p>
                          <p className="mt-3 opacity-80 text-sm">Just a conversation to see if we&rsquo;re the right fit.</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <form className="brand-card !p-8 md:!p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); if (canGoStep2) setStep(2) }}>
                        <FieldGroup label="You’re reaching out as…">
                          <div className="flex flex-wrap gap-2">
                            {REACHING.map((r) => (
                              <button key={r} type="button" onClick={() => setField('role', r)} className={`pill ${state.role === r ? 'pill-active' : ''}`}>{r}</button>
                            ))}
                          </div>
                        </FieldGroup>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FieldGroup label="Your name">
                            <input required value={state.name} onChange={(e) => setField('name', e.target.value)} className="brand-input" placeholder="Jane Doe" />
                          </FieldGroup>
                          <FieldGroup label="Your email">
                            <input required type="email" value={state.email} onChange={(e) => setField('email', e.target.value)} className="brand-input" placeholder="jane@brand.com" />
                          </FieldGroup>
                        </div>

                        <FieldGroup label="What do you want to talk about?">
                          <div className="flex flex-wrap gap-2">
                            {TOPICS.map((t) => (
                              <button key={t} type="button" onClick={() => setField('topic', t)} className={`pill ${state.topic === t ? 'pill-active' : ''}`}>{t}</button>
                            ))}
                          </div>
                        </FieldGroup>

                        <FieldGroup label="Anything else? (optional)">
                          <textarea value={state.project} onChange={(e) => setField('project', e.target.value)} className="brand-textarea" placeholder="Give us a little context before the call — an idea, a project, or whatever you have so far." rows={3} />
                        </FieldGroup>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <p className="text-xs opacity-60">Your information is secure and will only be used to schedule this call.</p>
                          <button type="submit" disabled={!canGoStep2} className="btn btn-primary">Choose a time <ArrowRight size={16} /></button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {!confirmed && step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                  <StepHeader step={2} label="Date & Time" />

                  <div className="mt-8 mb-10 max-w-3xl">
                    <h2 className="font-display uppercase leading-[0.9] tracking-tight text-display-lg text-balance">
                      Now, let&rsquo;s <span className="text-brand-orange">find a time.</span>
                    </h2>
                    <p className="mt-4 opacity-75 text-body-lg">Choose a date and time that works for you.</p>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Sidebar summary */}
                    <aside className="lg:col-span-4">
                      <div className="brand-card !p-6 sticky top-28">
                        <p className="eyebrow"><span className="eyebrow-dot" /> Call summary</p>
                        <h3 className="mt-4 font-display text-2xl uppercase leading-tight">20-min intro call</h3>
                        <ul className="mt-6 space-y-3 text-sm">
                          <SumRow label="Name" value={state.name} />
                          <SumRow label="Email" value={state.email} />
                          <SumRow label="You are" value={state.role} />
                          <SumRow label="Topic" value={state.topic} />
                          <SumRow label="Duration" value="20 minutes" />
                          <SumRow label="Timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                          <SumRow label="Date" value={state.date ? state.date.toDateString() : '—'} />
                          <SumRow label="Time" value={state.time || '—'} />
                        </ul>
                        <button onClick={() => setStep(1)} className="mt-6 inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100">
                          <ArrowLeft size={14} /> Back to details
                        </button>
                      </div>
                    </aside>

                    {/* Calendar + slots */}
                    <div className="lg:col-span-8">
                      <div className="brand-card !p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="eyebrow"><span className="eyebrow-dot" /> Pick a date</p>
                            <h3 className="mt-2 font-display text-3xl uppercase">{monthLabel}</h3>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={prevMonth} className="btn-icon !w-10 !h-10" aria-label="Previous month"><ChevronLeft size={16} /></button>
                            <button onClick={nextMonth} className="btn-icon !w-10 !h-10" aria-label="Next month"><ChevronRight size={16} /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs opacity-60 mb-2">
                          {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {monthData.days.map((d, i) => {
                            if (!d) return <div key={i} />
                            const isPast = d < today
                            const isWeekend = d.getDay() === 0 || d.getDay() === 6
                            const disabled = isPast || isWeekend
                            const isSelected = state.date && d.toDateString() === state.date.toDateString()
                            return (
                              <button
                                key={i}
                                disabled={disabled}
                                onClick={() => setField('date', d)}
                                className={`aspect-square rounded-lg text-sm font-medium transition-all
                                  ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-brand-orange/10 hover:text-brand-orange'}
                                  ${isSelected ? 'bg-brand-orange text-white hover:!bg-brand-orange hover:!text-white' : ''}
                                `}
                              >
                                {d.getDate()}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="brand-card !p-6 mt-4">
                        <p className="eyebrow"><span className="eyebrow-dot" /> Pick a time (20 min)</p>
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {TIMES.map((t) => (
                            <button key={t} disabled={!state.date} onClick={() => setField('time', t)}
                              className={`px-3 py-3 rounded-full border text-sm font-medium transition-all ${!state.date ? 'opacity-30 cursor-not-allowed' : 'hover:border-brand-orange hover:text-brand-orange'} ${state.time === t ? 'bg-brand-orange text-white border-brand-orange' : ''}`}
                              style={{ borderColor: 'var(--surface-border)' }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sticky bottom-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-card p-5 bg-brand-dark text-brand-cream border border-brand-dark">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="inline-flex items-center gap-2 opacity-80"><Clock size={14} /> 20 min</span>
                          <span className="inline-flex items-center gap-2 opacity-80"><CalendarClock size={14} /> {state.date ? state.date.toDateString() : 'Pick a date'}</span>
                          <span className="inline-flex items-center gap-2 opacity-80">{state.time ? `⏰ ${state.time}` : 'Pick a time'}</span>
                          <span className="inline-flex items-center gap-2 opacity-80"><Globe size={14} /> {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                        </div>
                        <button disabled={!state.date || !state.time} onClick={() => setConfirmed(true)} className="btn btn-primary">
                          Confirm booking <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {confirmed && (
                <motion.div key="conf" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl mx-auto text-center">
                  <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="w-24 h-24 mx-auto rounded-full bg-brand-orange text-white flex items-center justify-center shadow-brand-glow">
                    <Check size={44} strokeWidth={2.4} />
                  </motion.div>
                  <p className="mt-8 eyebrow mx-auto w-fit"><span className="eyebrow-dot" /> Booking confirmed</p>
                  <h1 className="mt-4 font-display uppercase leading-[0.9] tracking-tight text-display-xl text-balance">
                    You&rsquo;re all set. <br /> <span className="text-brand-orange">See you</span> then.
                  </h1>
                  <p className="mt-6 text-body-lg opacity-75 max-w-xl mx-auto">
                    Your call with OCT20FIVE is booked. We&rsquo;ve sent the confirmation and meeting details to your email.
                  </p>

                  <div className="mt-12 grid md:grid-cols-3 gap-4 text-left">
                    <div className="brand-card">
                      <p className="eyebrow"><span className="eyebrow-dot" /> Duration</p>
                      <h4 className="mt-4 font-display text-2xl uppercase">20 min call</h4>
                    </div>
                    <div className="brand-card">
                      <p className="eyebrow"><span className="eyebrow-dot" /> When</p>
                      <h4 className="mt-4 font-display text-lg uppercase leading-tight">{state.date ? state.date.toDateString() : '\u2014'}<br />{state.time} {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace('_',' ')}</h4>
                    </div>
                    <div className="brand-card">
                      <p className="eyebrow"><span className="eyebrow-dot" /> Where</p>
                      <h4 className="mt-4 font-display text-2xl uppercase">Google Meet</h4>
                    </div>
                  </div>

                  <div className="mt-6 brand-card text-left">
                    <p className="eyebrow"><span className="eyebrow-dot" /> Check your email</p>
                    <p className="mt-3 opacity-80">Your confirmation, meeting link, and booking details are on their way to <span className="font-medium">{state.email}</span>.</p>
                  </div>

                  <p className="mt-8 text-sm opacity-60">Need to reschedule or cancel? Use the link in your confirmation email.</p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button className="btn btn-primary">Add to calendar <ArrowUpRight size={16} /></button>
                    <Link href="/" className="btn btn-outline">Back to OCT20FIVE <ArrowUpRight size={16} /></Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  )
}

function StepHeader({ step, label }) {
  return (
    <div className="flex items-center gap-6">
      <SectionTag>{`Step ${step} of 2`}</SectionTag>
      <div className="flex items-center gap-2 flex-1">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-brand-orange' : 'bg-black/10'}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-brand-orange' : 'bg-black/10'}`} />
      </div>
      <span className="text-sm opacity-60 font-medium">{label}</span>
    </div>
  )
}

function FieldGroup({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="eyebrow"><span className="eyebrow-dot" /> {label}</label>
        {hint && <span className="text-xs opacity-60">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function SumRow({ label, value }) {
  return (
    <li className="flex items-start gap-2">
      <span className="opacity-50 min-w-[70px]">{label}</span>
      <span className="font-medium break-all">{value || '—'}</span>
    </li>
  )
}
