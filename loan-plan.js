'use strict';
(() => {
  const plans = [
    {name:'آوند', amount:500000000, icon:'arman.png', months:[6,12], installment:89012040, total:534072210},
    {name:'گوهر', amount:1000000000, icon:'arvand.png', months:[6,12,18], selectedMonth:12, installment:94076320, total:1128915860},
    {name:'سرآمد', amount:1500000000, icon:'mana.png', months:[12,18,24], selectedMonth:12},
    {name:'فاخر', amount:2000000000, icon:'kian.png', months:[12,18,24]},
    {name:'والا', amount:2500000000, icon:'mehras.png', months:[12,18,24]},
    {name:'آرمان', amount:3000000000, icon:'saramad.png', months:[12,18,24]}
  ];
  const fmt = n => Math.round(n).toLocaleString('fa-IR');
  const money = (n,kind='') => `<span class="money ${kind}"><b>${fmt(n)}</b><span class="rial-icon" role="img" aria-label="ریال"></span></span>`;
  const subscriptionRial = plan => {
    const months=plan.selectedMonth||plan.months[0];
    if(months===6&&plan.amount===500000000) return 27000000;
    if(months===12&&plan.amount===1500000000) return 153000000;
    const reference=months===6?{amount:500000000,fee:48254584}:{amount:1000000000,fee:102000000};
    return Math.round(plan.amount*reference.fee/reference.amount);
  };
  function amounts(plan) {
    if (plan.installment && plan.total) return {installment:plan.installment,total:plan.total};
    const months=plan.selectedMonth||plan.months[0], rate=.23/12;
    const installment=Math.round(plan.amount*rate/(1-Math.pow(1+rate,-months)));
    return {installment,total:installment*months};
  }
  window.loanPlans=plans;
  window.loanPlanIndex=0;
  window.renderLoanPlan=(screen,onChange,onContinue)=>{
    const index=window.loanPlanIndex,plan=plans[index],{installment,total}=amounts(plan),fee=subscriptionRial(plan);
    const wrap=document.createElement('section');wrap.className='loan-plan';wrap.setAttribute('aria-label','انتخاب طرح و اقساط');
    const selectedMonth=plan.selectedMonth||plan.months[0];
    wrap.innerHTML=`<style>
      .loan-plan{position:absolute;z-index:5;left:0;top:226px;width:375px;height:586px;background:linear-gradient(#eef9fa 0,#f7fafb 100px,#fafafa 100px);direction:rtl;color:#111827;font-family:IRANSansFaNum,sans-serif}
      .loan-plan *{box-sizing:border-box}.loan-plan .plan-head{height:82px;display:flex;align-items:center;justify-content:space-between;padding:0 16px}.loan-plan .plan-center{text-align:center;min-width:220px}.loan-plan .plan-name{display:flex;align-items:center;justify-content:center;gap:8px;font-size:16px;font-weight:500;line-height:24px}.loan-plan .plan-name img{width:20px;height:20px;object-fit:contain}.loan-plan .plan-amount{display:flex;justify-content:center;margin-top:6px;color:#092a47;font-size:16px;font-weight:700;line-height:24px}.loan-plan .arrow{border:0;background:none;color:#00949f;font:30px Arial,sans-serif;line-height:1;width:30px;height:42px;cursor:pointer}.loan-plan .arrow:disabled{opacity:.24;cursor:default}.loan-plan .arrow:focus-visible,.loan-plan .choose:focus-visible{outline:2px solid #ffc93b;outline-offset:2px}
      .loan-plan .money{display:inline-flex;align-items:center;gap:3px;white-space:nowrap;direction:rtl}.loan-plan .money b{font:inherit}.loan-plan .rial-icon{display:inline-block;flex:none;width:24px;height:24px;background:currentColor;mask:url('images/rial.svg') center/contain no-repeat;-webkit-mask:url('images/rial.svg') center/contain no-repeat}
      .loan-plan .plan-tabs{display:flex;align-items:center;height:44px;margin:7px 16px 16px;padding:8px;background:#f8f8f8;border:1px solid rgba(3,98,108,.1);border-radius:40px;box-shadow:0 0 12px rgba(6,75,77,.08)}.loan-plan .plan-tabs span{height:26px;flex:1;display:flex;align-items:center;justify-content:center;border-radius:40px;color:#252525;font-size:14px;font-weight:500;line-height:20px}.loan-plan .plan-tabs .selected{background:#092a47;color:#e6eaed}
      .loan-plan .plan-details{margin:0 16px;background:#092a47;border-radius:12px;color:#fff;padding:12px 16px 16px;height:238px}.loan-plan .detail-title{display:flex;align-items:center;justify-content:center;height:30px;margin-bottom:8px}.loan-plan .plan-chip{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.2);border-radius:100px;padding:4px 8px;height:30px;font-size:12px;font-weight:500;line-height:20px}.loan-plan .plan-chip img{width:20px;height:20px;object-fit:contain}.loan-plan .detail-row{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.35);height:36px;font-size:14px;font-weight:500;line-height:20px}.loan-plan .detail-row:last-child{border-bottom:0}.loan-plan .detail-row strong{color:#fff;font-weight:500}.loan-plan .detail-row .gold{color:#ffc93b;font-weight:700}
      .loan-plan .plan-fee{margin:16px 16px 0;padding:12px 16px;background:#e5f4f5;border:1px solid #d1e8e9;border-radius:12px;min-height:94px;color:#565656}.loan-plan .fee-row{display:flex;justify-content:space-between;gap:8px;font-size:13px;font-weight:500;line-height:18px}.loan-plan .fee-row strong{white-space:nowrap;font-weight:500;color:#252525}.loan-plan .plan-fee p{font-size:12px;line-height:20px;color:#565656;margin:6px 0 0}.loan-plan .choose{position:absolute;left:16px;bottom:21px;width:343px;height:42px;border:0;border-radius:12px;background:#092a47;color:#fff;font:500 16px IRANSansFaNum,sans-serif;cursor:pointer}
    </style><div class="plan-head"><button type="button" class="arrow next" aria-label="طرح با مبلغ بیشتر" ${index===plans.length-1?'disabled':''}>‹</button><div class="plan-center"><div class="plan-name"><img src="images/${plan.icon}?v=20261015-full" alt="نماد ${plan.name}"><span>${plan.name}</span></div><div class="plan-amount">${money(plan.amount)}</div></div><button type="button" class="arrow previous" aria-label="طرح با مبلغ کمتر" ${index===0?'disabled':''}>›</button></div><div class="plan-tabs" aria-label="تعداد اقساط">${plan.months.map(m=>`<span class="${m===selectedMonth?'selected':''}" ${m===selectedMonth?'aria-current="true"':''}>${fmt(m)} ماه</span>`).join('')}</div><div class="plan-details"><div class="detail-title"><span class="plan-chip"><img src="images/${plan.icon}?v=20261015-full" alt="">${plan.name}</span></div><div class="detail-row"><span>مبلغ وام</span><strong class="gold">${money(plan.amount)}</strong></div><div class="detail-row"><span>مبلغ هر قسط</span><strong>${money(installment)}</strong></div><div class="detail-row"><span>تعداد اقساط</span><strong>${fmt(selectedMonth)} ماه</strong></div><div class="detail-row"><span>سود سالانه</span><strong>۲۳٪</strong></div><div class="detail-row"><span>مجموع بازپرداخت</span><strong>${money(total)}</strong></div></div><div class="plan-fee" data-total-rial="${total}" data-fee-rial="${fee}"><div class="fee-row"><span>حق اشتراک ${plan.name}</span><strong>${money(fee)}</strong></div><p>اشتراک در پایان فرایند به انتخاب شما به صورت نقدی یا از مبلغ وام دریافت می‌شود.</p></div><button type="button" class="choose">انتخاب طرح</button>`;
    const change=step=>{const next=Math.min(plans.length-1,Math.max(0,window.loanPlanIndex+step));if(next!==window.loanPlanIndex){window.loanPlanIndex=next;onChange(next);}};
    wrap.querySelector('.next').onclick=()=>change(1);wrap.querySelector('.previous').onclick=()=>change(-1);wrap.querySelector('.choose').onclick=onContinue;
    let startX=0;wrap.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});wrap.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>35)change(dx<0?1:-1)},{passive:true});
    screen.append(wrap);
  };
})();
