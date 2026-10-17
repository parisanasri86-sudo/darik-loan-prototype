'use strict';
(() => {
  const fmt=n=>n.toLocaleString('fa-IR');
  const fee=102000000,net=1000000000-fee;
  const white='#fff',paper='#fafafa',navy='#092a47';
  function textPatch(root,{x,y,w,h,text,bg=white,color='#26343d',size=12,align='right',weight=400,lineHeight='1.5'}){
    const el=document.createElement('div');el.className='loan-text-patch';
    const parts=text.split('ریال');parts.forEach((part,i)=>{el.append(document.createTextNode(part));if(i<parts.length-1){const icon=document.createElement('span');icon.className='rial-inline';icon.setAttribute('role','img');icon.setAttribute('aria-label','ریال');el.append(icon);}});
    Object.assign(el.style,{position:'absolute',left:x+'px',top:y+'px',width:w+'px',height:h+'px',background:bg,color,fontSize:size+'px',fontWeight:String(weight),fontFamily:'IRANSansFaNum,sans-serif',textAlign:align,display:'flex',alignItems:'center',justifyContent:align==='left'?'flex-end':align==='center'?'center':'flex-start',direction:'rtl',lineHeight:typeof lineHeight==='number'?lineHeight+'px':lineHeight,padding:'0 2px',pointerEvents:'none',zIndex:'4'});root.append(el);
  }
  function instructionPatch(root,{y,text}){
    const el=document.createElement('div');el.className='loan-text-patch cheque-instruction-patch';el.textContent=text;
    Object.assign(el.style,{position:'absolute',left:'27px',top:y+'px',width:'323px',height:'48px',background:white,color:'#26343d',font:'400 11px/18px IRANSansFaNum,sans-serif',textAlign:'right',direction:'rtl',padding:'5px 2px',pointerEvents:'none',zIndex:'4',boxSizing:'border-box'});root.append(el);
  }
  function namePatch(root,y,bg=white,x=240,w=106,padRight=0){
    const el=document.createElement('div');el.className='loan-name-patch';Object.assign(el.style,{position:'absolute',left:x+'px',top:y+'px',width:w+'px',height:'28px',background:bg,color:bg===white?'#26343d':'#fff',display:'flex',alignItems:'center',justifyContent:'flex-start',gap:'4px',direction:'rtl',paddingRight:padRight+'px',font:'700 14px IRANSansFaNum,sans-serif',pointerEvents:'none',zIndex:'4'});el.innerHTML='<img src="images/arvand.png?v=20261015-full" alt="" style="width:18px;height:22px;object-fit:contain">گوهر ۲';root.append(el);
  }
  function exactWalletCard(root,id){
    const img=document.createElement('img');
    img.className='loan-wallet-card-exact';
    img.src=id==='5765:190044'?'images/wallet-card-initial-2x.png':'images/wallet-card-transactions-2x.png';
    img.alt='';
    Object.assign(img.style,{position:'absolute',left:'16px',top:'106px',width:'343px',height:'240px',objectFit:'contain',pointerEvents:'none',zIndex:'5'});
    root.append(img);
  }
  function walletNamePatch(root){
    const el=document.createElement('div');el.className='loan-wallet-name-patch';el.textContent='طرح گوهر ۲';
    Object.assign(el.style,{position:'absolute',left:'132px',top:'160px',width:'112px',height:'30px',background:'#164271',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',direction:'rtl',whiteSpace:'nowrap',font:'500 18px/30px IRANSansFaNum,sans-serif',pointerEvents:'none',zIndex:'6'});root.append(el);
  }
  function planBadgePatch(root,y){
    const cover=document.createElement('span');
    Object.assign(cover.style,{position:'absolute',left:'172px',top:(y-2)+'px',width:'32px',height:'34px',background:'#e5f4f5',pointerEvents:'none',zIndex:'4'});
    const icon=document.createElement('img');icon.src='images/arvand.png?v=20261015-full';icon.alt='نماد گوهر ۲';
    Object.assign(icon.style,{position:'absolute',left:'172px',top:y+'px',width:'32px',height:'32px',objectFit:'contain',pointerEvents:'none',zIndex:'5'});
    root.append(cover,icon);
  }
  function installmentPrincipalPatch(root){
    const group=document.createElement('div');
    group.className='loan-installment-principal-patch';
    Object.assign(group.style,{position:'absolute',left:'95px',top:'172px',width:'185px',height:'28px',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:'2px',direction:'ltr',pointerEvents:'none',zIndex:'4'});
    const rial=document.createElement('span');rial.className='rial-inline';rial.setAttribute('role','img');rial.setAttribute('aria-label','ریال');
    Object.assign(rial.style,{width:'20px',height:'20px',color:'#565656'});
    const amount=document.createElement('span');amount.textContent='۱٬۰۰۰٬۰۰۰٬۰۰۰';
    Object.assign(amount.style,{color:'#00949f',font:'700 14px/22px IRANSansFaNum,sans-serif',direction:'rtl',whiteSpace:'nowrap'});
    group.append(rial,amount);root.append(group);
  }
  function exactTransactionCard(root,id){
    const card=document.createElement('section');card.className='loan-transaction-card-exact';card.setAttribute('aria-label','تراکنش موفق');
    Object.assign(card.style,{position:'absolute',left:'16px',top:(id==='5765:190044'?590:736)+'px',width:'343px',height:'68px',padding:'12px',borderRadius:'12px',background:'#fff',display:'flex',flexDirection:'column',gap:'4px',fontFamily:'IRANSansFaNum,sans-serif',boxSizing:'border-box',pointerEvents:'none',zIndex:'5'});
    const first=document.createElement('div');Object.assign(first.style,{height:'24px',width:'319px',display:'flex',alignItems:'center',justifyContent:'space-between',direction:'ltr'});
    const status=document.createElement('span');status.textContent='موفق';Object.assign(status.style,{color:'#005321',fontSize:'12px',fontWeight:'400',lineHeight:'16px',whiteSpace:'nowrap',direction:'rtl'});
    const value=document.createElement('div');Object.assign(value.style,{width:'166px',height:'24px',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'4px',direction:'ltr'});
    const money=document.createElement('div');Object.assign(money.style,{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'4px',height:'24px',direction:'ltr'});
    const rialWrap=document.createElement('span');rialWrap.setAttribute('role','img');rialWrap.setAttribute('aria-label','ریال');Object.assign(rialWrap.style,{width:'24px',height:'24px',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'});
    const rial=document.createElement('img');rial.src='images/transaction-rial.svg';rial.alt='';Object.assign(rial.style,{width:'18.923px',height:'12.092px',display:'block',flex:'none'});rialWrap.append(rial);
    const amount=document.createElement('strong');amount.textContent='۸۹۸٬۰۰۰٬۰۰۰';Object.assign(amount.style,{color:'#111827',fontSize:'14px',fontWeight:'700',lineHeight:'20px',whiteSpace:'nowrap',direction:'rtl'});
    const arrow=document.createElement('img');arrow.src='images/transaction-arrow.svg';arrow.alt='';Object.assign(arrow.style,{width:'12px',height:'12px',display:'block',flex:'none',transform:'rotate(180deg) scaleX(-1)'});
    money.append(rialWrap,amount);value.append(money,arrow);first.append(status,value);
    const second=document.createElement('div');Object.assign(second.style,{width:'319px',height:'16px',display:'flex',alignItems:'center',justifyContent:'space-between',direction:'ltr'});
    const date=document.createElement('span');date.textContent='۱۴۰۵/۰۶/۱۰  -  ۱۹:۵۸';Object.assign(date.style,{color:'#797979',fontSize:'12px',fontWeight:'400',lineHeight:'16px',whiteSpace:'pre',direction:'rtl'});
    const description=document.createElement('span');description.textContent='واریز اعتبار طرح گوهر ۲ با کسر حق اشتراک';Object.assign(description.style,{color:'#565656',fontSize:'12px',fontWeight:'400',lineHeight:'16px',whiteSpace:'nowrap',direction:'rtl'});
    second.append(date,description);card.append(first,second);root.append(card);
  }
  const details=['5765:189441','5765:189544','5765:189647'];
  const tracked={'5765:189755':287,'5765:189825':287,'5765:189904':307,'5765:189974':287};
  window.applyLoanScreenOverrides=(id,root)=>{
    if(details.includes(id)){
      namePatch(root,228);
      textPatch(root,{x:20,y:179,w:340,h:28,text:'پیش از ثبت، اطلاعات مالی و روش پرداخت حق اشتراک را بررسی کنید.',bg:paper,size:12});
      for(const y of [483,619]){
        textPatch(root,{x:140,y:y-2,w:205,h:28,text:'حق اشتراک گوهر ۲',size:14});
        textPatch(root,{x:20,y:y-2,w:121,h:28,text:fmt(fee)+' ریال',align:'left',size:14});
      }
      textPatch(root,{x:30,y:510,w:316,h:28,text:'حق اشتراک از مبلغ وام دریافتی شما کسر می‌شود.',size:12});
      textPatch(root,{x:30,y:646,w:316,h:28,text:'حق اشتراک را از طریق درگاه بانکی پرداخت می‌کنید.',size:12});
      textPatch(root,{x:40,y:id==='5765:189647'?799:727,w:290,h:29,text:'جزئیات وام و حق اشتراک را خواندم و تأیید می‌کنم.',size:12});
    }
    if(Object.hasOwn(tracked,id)&&id!=='5765:189825') namePatch(root,tracked[id]-14,white,220,132,6);
    if(['5765:189755','5765:189904','5765:189974'].includes(id)) textPatch(root,{x:25,y:id==='5765:189755'?726:id==='5765:189904'?746:738,w:284,h:26,text:'بررسی تسویه حق اشتراک',size:11});
    if(id==='5765:189825'){
      textPatch(root,{x:16,y:627,w:343,h:91,text:'با انصراف از ادامه فرایند، درخواست فعلی شما بسته می‌شود. چنانچه حق اشتراک ارائه خدمات پرداخت شده باشد، مبلغ آن قابل استرداد نیست. ثبت درخواست جدید در هر زمان امکان‌پذیر است.',bg:'#fff',size:13,align:'center'});
    }
    if(['5765:190044','5765:190156'].includes(id)){
      exactWalletCard(root,id);
      walletNamePatch(root);
      planBadgePatch(root,396);
      exactTransactionCard(root,id);
      if(id==='5765:190044'){
        textPatch(root,{x:55,y:496,w:119,h:27,text:fmt(net)+' ریال',size:11,align:'left'});
      }
    }
    if(['5765:190639','5765:190817','5765:190940'].includes(id)){
      planBadgePatch(root,123);
      installmentPrincipalPatch(root);
    }
    if(id==='5765:190553') textPatch(root,{x:113,y:149,w:116,h:31,text:'طرح گوهر ۲',bg:navy,color:'#fff',size:14,weight:500});
    if(['5765:190432','5765:192503','5765:192556'].includes(id)){
      instructionPatch(root,{y:239,text:'مبلغ چک را برابر ۱٬۳۵۴٬۶۹۹٬۰۳۲ ریال بدون خط‌خوردگی و با تاریخ مشخص شده بنویسید.'});
      instructionPatch(root,{y:279,text:'چک باید در وجه شرکت نوآوران بوم گستر امیدبوم بابت دریافت تسهیلات طرح گوهر ۲ صادر گردد.'});
    }
    if(id==='5765:192609'){
      textPatch(root,{x:15,y:575,w:345,h:68,text:'کارشناسان ما در اسرع وقت آن را بررسی خواهند کرد. نتیجه از طریق پیامک ارسال می‌شود و با تأیید، امکان مشاهده جزئیات وام و پرداخت حق اشتراک برای شما باز می‌شود.',bg:paper,size:14,align:'center'});
      textPatch(root,{x:83,y:753,w:210,h:34,text:'تأیید نهایی و پرداخت حق اشتراک',bg:'#e4e4e6',color:'#b2b2b2',size:14,weight:500,align:'center'});
    }
    if(id==='5765:192664') textPatch(root,{x:78,y:751,w:220,h:35,text:'تأیید نهایی و پرداخت حق اشتراک',bg:'#092a47',color:'#fff',size:14,weight:500,align:'center'});
  };
})();
