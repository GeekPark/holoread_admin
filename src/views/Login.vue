<template lang="jade">
#login
  form
    .group
      h1 GeekPark
    .group
      input(type='email', v-model='form.email')
      span.highlight
      span.bar
      label Email
    .group
      input(type='password', v-model='form.password')
      span.highlight
      span.bar
      label Password
    button.button.buttonBlue(type='button', @click='submit')
      | Login
      .ripples.buttonRipples
        span.ripplesCircle
    .footer
      p.forgot Forgot password ?
</template>

<script>
import api from '../stores/api'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submit () {
      api.post('admin/account/login', this.form).then((result) => {
        localStorage.setItem('email', result.data.data.email);
        this.$message.success('success')
        this.$router.push('/')
      }).catch((err) => {
        this.$message.error(err.toString())
      })
    }
  }
}

</script>

<style lang="stylus">
#login {
  position absolute;
  z-index 10;
  width 100%;
  height 100%;
  background #fff;
  top 0;
  text-align center;

  * { box-sizing:border-box; }

  body {
    font-family: Helvetica;
    background: #eee;
    -webkit-font-smoothing: antialiased;
  }

  hgroup {
    text-align:center;
    margin-top: 4em;
  }

  h1, h3 { font-weight: 300; }

  h1 { color: #636363; }

  h3 { color: #4a89dc; }

  form {
    width: 380px;
    margin: 4em auto;
    padding: 3em 2em 2em 2em;
    background: #eef1f6;
    box-shadow 0px 2px 10px 3px rgba(0,0,0,0.15);
  }

  .group {
    position: relative;
    margin-bottom: 45px;
  }

  input {
    font-size: 18px;
    padding: 10px 10px 10px 5px;
    -webkit-appearance: none;
    display: block;
    background: #fafafa;
    color: #636363;
    width: 100%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #757575;
  }

  input:focus { outline: none; }


  /* Label */

  label {
    color: #999;
    font-size: 18px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 10px;
    transition: all 0.2s ease;
    top: -20px;
    transform: scale(.75); left: -2px;
    color: #4a89dc;
  }


  /* active */

  // input:focus ~ label, input.used ~ label {

  // }


  /* Underline */

  .bar {
    position: relative;
    display: block;
    width: 100%;
  }

  .bar:before, .bar:after {
    content: '';
    height: 2px;
    width: 0;
    bottom: 1px;
    position: absolute;
    background: #4a89dc;
    transition: all 0.2s ease;
  }

  .bar:before { left: 50%; }

  .bar:after { right: 50%; }


  /* active */

  input:focus ~ .bar:before, input:focus ~ .bar:after { width: 50%; }


  /* Highlight */

  .highlight {
    position: absolute;
    height: 60%;
    width: 100px;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
  }


  /* active */

  input:focus ~ .highlight {
    animation: inputHighlighter 0.3s ease;
  }


  /* Animations */

  @keyframes inputHighlighter {
    from { background: #4a89dc; }
    to  { width: 0; background: transparent; }
  }


  /* Button */

  .button {
    position: relative;
    display: inline-block;
    padding: 12px 24px;
    margin: .3em 0 1em 0;
    width: 100%;
    vertical-align: middle;
    color: #fff;
    font-size: 16px;
    line-height: 20px;
    -webkit-font-smoothing: antialiased;
    text-align: center;
    letter-spacing: 1px;
    background: transparent;
    border: 0;
    border-bottom: 2px solid #3160B6;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .button:focus { outline: 0; }


  /* Button modifiers */

  .buttonBlue {
    background: #4a89dc;
    text-shadow: 1px 1px 0 rgba(39, 110, 204, .5);
  }

  .buttonBlue:hover { background: #357bd8; }


  /* Ripples container */

  .ripples {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }


  /* Ripples circle */

  .ripplesCircle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
  }

  .ripples.is-active .ripplesCircle {
    animation: ripples .4s ease-in;
  }


  /* Ripples animation */

  @keyframes ripples {
    0% { opacity: 0; }

    25% { opacity: 1; }

    100% {
      width: 200%;
      padding-bottom: 200%;
      opacity: 0;
    }
  }

  .footer p {
    color #888
    font-size 15px
    letter-spacing .4px
    cursor pointer
  }

  .footer img {
    width 25px
    margin 10px
    cursor pointer
  }

  // .footer .register {
  //   float left
  // }

  // .footer .forgot {
  //   float right
  // }

  footer {
    text-align: center;
  }

  footer p {
    color: #888;
    font-size: 13px;
    letter-spacing: .4px;
  }

  footer a {
    color: #4a89dc;
    text-decoration: none;
    transition: all .2s ease;
  }

  footer a:hover {
    color: #666;
    text-decoration: underline;
  }

  footer img {
    width: 80px;
    transition: all .2s ease;
  }

  footer img:hover { opacity: .83; }

  footer img:focus , footer a:focus { outline: none; }
}
</style>
