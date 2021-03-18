
const card= document.querySelector('.card');
const container=document.querySelector('.container');

const title=document.querySelector('.title');
const sneaker=document.querySelector('.sneaker img');
const purchase=document.querySelector('.purchase input');
const description=document.querySelector('.info h3');
const size=document.querySelector('.sizes');
const stopBtn=document.getElementById('stop');

var flag=true;

container.addEventListener('mousemove',(e)=>{
    if(flag==false)
    return;
    let xAxis=(window.innerWidth / 2-e.pageX)/25;
    let yAxis=(window.innerHeight / 2-e.pageY)/25;
    card.style.transform=`rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
})


//애니메이션 들어갈때
container.addEventListener('mouseenter',e=>{
    if(flag==false)
    return;
    card.style.transition='none';
    //popout
    title.style.transform='translateZ(150px)'
    sneaker.style.transform='translateZ(200px) rotateZ(45deg)'
    description.style.transform='translateZ(125px)'
    size.style.transform='translateZ(100px)'
    purchase.style.transform='translateZ(75px)'
})

//애니메이션 나올때 트렌지션 주의
container.addEventListener('mouseleave',e=>{
    if(flag==false)
        return;
    card.style.transition='all 0.5s ease';
    card.style.transform=`rotateY(0deg) rotateX(0deg)`;
    //popback
    title.style.transform='translateZ(0px)'
    sneaker.style.transform='translateZ(0px) rotateZ(0deg)'
    description.style.transform='translateZ(0px)'
    size.style.transform='translateZ(0px)'
    purchase.style.transform='translateZ(0px)'
})

container.addEventListener('click',e=>{
    if(flag==false)
      flag=  true;
        else{
            flag=false;
            card.style.transition='all 0.5s ease';
    card.style.transform=`rotateY(0deg) rotateX(0deg)`;
            title.style.transform='translateZ(0px)'
            sneaker.style.transform='translateZ(0px) rotateZ(0deg)'
            description.style.transform='translateZ(0px)'
            size.style.transform='translateZ(0px)'
            purchase.style.transform='translateZ(0px)'
      
        }
  
    

})