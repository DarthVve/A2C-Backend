export function walletNotification(updatedWallet: number, amount: number) {
  let temp = `
    <div style="background: #E5E5E5; height: 100%; padding-bottom: 30px;">
    <div style="max-width: 600px;text-align: center;background: #fff; text-transform: uppercase;
     margin:auto; padding: 50px 20px; font-size: 16px; margin-bottom: 25px;">
      
      <div style=" text-align:center; display:flex; justify-content: center; align-items:center;">
      
                <p style="color: #DE3D6D; font-size: 25px; display:flex; justify-content: center; align-items:center; margin: auto;"><img src="https://res.cloudinary.com/deqb447mp/image/upload/v1664044669/airtime2Cash/u8pxu0260n2wumj3wpkj.png" alt="logo" border="0" style="width: 25px; height: 35px;">Airtime<span style="color: #F5844C;">2Cash</span></p>
      </div>
      <div style="text-align:center; background:#DE3D6D; border-radius: 10px; padding: 20px 15px;">
      <div style="margin: 15px auto;">
        <h3 style="color:#fff; padding-top: 12px;">Description:Credit Alert</h3>
        <h3 style="color:#fff;">Credit: &#8358;${amount}</h3>
        <h3 style="color: #fff; padding-bottom: 12px;">Available Balance: <span>&#8358;${updatedWallet}</span></h3>
      </div>
      </div>
   </div> 
   </div>
    `;
    return temp
}