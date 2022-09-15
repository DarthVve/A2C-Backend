export function emailVerificationView(token: string): string {
  const link =`${process.env.ROOT_URL}/user/verify/${token}`;
  let temp = `
  <div
  style="
    background: rgba(243, 137, 84, 0.05);
    padding: 2rem 3rem;
    width: max-content;
    max-width: 20rem;
    text-align: center;
    border: 0.5rem dashed purple;
    border-radius: 1rem;
  "
  position="relative"
>
  <div>
    <h3
      style="
        position: relative;
        top: -1rem;
        width: 1.3rem;
        height: 2.3rem;
        background: linear-gradient(
          145deg,
          rgb(244, 185, 76) 70%,
          rgb(237, 155, 3) 70% 30%
        );
        -ms-transform: rotate(30deg);
        transform: rotate(30deg);
        margin-right: 2rem;
        margin-bottom: -2rem;
      "
    >
      &nbsp;
    </h3>
    <h3
      style="
        position: relative;
        top: -3rem;
        left: 0.35rem;
        display: block;
        content: '';
        width: 1.3rem;
        height: 2.3rem;
        transform: rotate(33deg);
        background: linear-gradient(
          325deg,
          rgb(186, 1, 146) 70%,
          purple 70% 30%
        );
      "
    >
      &nbsp;
    </h3>
  </div>
  <h4
    style="
      position: relative;
      top: -8rem;
      left: 2.1rem;
      display: flex;
      justify-content: center;
      text-align: center;
      margin: 0 auto;
      color: rgb(186, 1, 146);
      font-weight: 500;
      font-size: 2rem;
    "
  >
    Airtime<span style="color: orange">2cash</span>
  </h4>
  <h2
    style="
      font-family: Inter;
      font-style: normal;
      font-weight: 700;
      font-size: 3rem;
      margin-top: -9rem;
      background: linear-gradient(89.39deg, #de3d6d 18.77%, #f5844c 91.68%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      -text-fill-color: transparent;
      text-transform: capitalize;
    "
  >
    Hurray!!!
    <span style="display: block; font-size: 2rem">almost there</span>
  </h2>
  <p style="font-size: 1rem">Click the button to verify your email</p>

  <a href=${link}
    style="
      color: white;
      font-size: 1.2rem;
      padding: 0.5rem 1.5rem;
      background: linear-gradient(75deg, rgb(186, 1, 146), orange);
      border-radius: 0.5rem;
      border: none;
      text-transform: capitalize;
      cursor: pointer;
      text-decoration: none;
   "
  >
    Verify
</a>
</div>
      `;
  return temp;
}
