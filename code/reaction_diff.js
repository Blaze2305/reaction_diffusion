// https://www.karlsims.com/rd.html 
//  refrence site above;

let current=[];
let next=[];
let D_a=1;
let D_b=0.5;
let feed=0.055;
let kill=0.062;
let delta=1;



function setup(){
    createCanvas(600,600);
    pixelDensity(1);

    for(let i=0;i<width;i++){
        current[i]=[];
        next[i]=[];
        
        // init of the grid with chem a=1; chem b=0;
        for(let j=0;j<height;j++){
            current[i][j]={a:1,b:0};
            next[i][j]={a:1,b:0};
        }
    }

    // set location where chem b is present;
    for(let i=100;i<130;i++){
        for(let j=100;j<130;j++){
            current[i][j].b=1;
        }
    }
}
    

function draw(){
    background(100);

    // show the grayscale value for each pixel based on amount of chem a and b
    loadPixels();
    for(let i=0;i<width;i++){
        for(let j=0;j<height;j++){
            let index=(i+j*width)*4;
            let c=(current[i][j].a-current[i][j].b)*255;
            pixels[index]=c;
            pixels[index+1]=c;
            pixels[index+2]=c;
            pixels[index+3]=255;
        }
    }
    updatePixels();


    // calcaulate the next a and b amounts

    for(let i=1;i<width-1;i++){
        for(let j=1;j<height-1;j++){

            let A=current[i][j].a;
            let B=current[i][j].b;

            let new_a=A+(D_a*laplacian_a(i,j) - A*B*B + feed*(1-A))*delta;
            let new_b=B+(D_b*laplacian_b(i,j) + A*B*B -B*(feed+kill))*delta;

            next[i][j].a=new_a;
            next[i][j].b=new_b;
        }
    }

    swap();
}

function laplacian_a(i,j){
    let sum=0;
    let weights=[-1,0.2,0.05];
    let x=[-1,0,1];
    let y=[-1,0,1];
    for(let p of x){
        for(let q of y){
            let w;
            if(p==0 && q==0){
                w=weights[0];
            }
            else if(p==0 || q==0){
                w=weights[1];
            }
            else{
                w=weights[2];
            }
            sum+=current[i+p][j+q].a*w;
        }
    }
    return(sum);
}

function laplacian_b(i,j){
    let sum=0;
    let weights=[-1,0.2,0.05];
    let x=[-1,0,1];
    let y=[-1,0,1];
    for(let p of x){
        for(let q of y){
            let w;
            if(p==0 && q==0){
                w=weights[0];
            }
            else if(p==0 || q==0){
                w=weights[1];
            }
            else{
                w=weights[2];
            }
            sum+=current[i+p][j+q].b*w;
        }
    }
    return(sum);
}


function swap(){
    let temp=current;
    current=next;
    next=temp;
}