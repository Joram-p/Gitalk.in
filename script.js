*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

body{
  font-family:Arial,Helvetica,sans-serif;
  background:#f1f3f6;
  color:#222;
}

button{
  border:0;
  cursor:pointer;
}

.hidden{
  display:none!important;
}


/* AUTH */

.auth-page{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:linear-gradient(135deg,#6c2cff,#ff3d81);
}

.auth-box{
  width:100%;
  max-width:400px;
  background:white;
  padding:35px 25px;
  border-radius:20px;
  box-shadow:0 15px 40px rgba(0,0,0,.2);
  text-align:center;
}

.logo{
  font-size:32px;
  font-weight:bold;
  color:#6c2cff;
  margin-bottom:15px;
}

.logo span,
.brand span{
  color:#ff3d81;
}

.auth-box h2{
  margin-bottom:8px;
}

.auth-box p{
  color:#777;
  margin-bottom:20px;
}

.auth-box input{
  width:100%;
  padding:14px;
  margin:8px 0;
  border:1px solid #ddd;
  border-radius:10px;
  outline:none;
  font-size:15px;
}

.auth-box input:focus{
  border-color:#6c2cff;
}

.auth-box button{
  width:100%;
  padding:14px;
  margin-top:12px;
  border-radius:10px;
  background:#6c2cff;
  color:white;
  font-size:16px;
  font-weight:bold;
}

.switch{
  margin-top:20px!important;
  margin-bottom:0!important;
}

.switch a{
  color:#6c2cff;
  font-weight:bold;
  cursor:pointer;
}

.message{
  margin-top:15px;
  font-weight:bold;
}


/* TOP BAR */

.topbar{
  height:65px;
  background:white;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 20px;
  box-shadow:0 2px 10px rgba(0,0,0,.08);
  position:sticky;
  top:0;
  z-index:10;
}

.brand{
  font-size:25px;
  font-weight:bold;
  color:#6c2cff;
}

.top-actions{
  display:flex;
  gap:8px;
}

.top-actions button{
  padding:9px 12px;
  border-radius:8px;
  background:#eee;
}

.top-actions button:last-child{
  background:#ff3d81;
  color:white;
}


/* CONTAINER */

.container{
  width:100%;
  max-width:700px;
  margin:auto;
  padding:20px 15px 50px;
}


/* USER */

.welcome-card{
  background:white;
  padding:15px;
  border-radius:15px;
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:15px;
}

.avatar,
.big-avatar{
  background:linear-gradient(135deg,#6c2cff,#ff3d81);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:bold;
  border-radius:50%;
}

.avatar{
  width:48px;
  height:48px;
  font-size:20px;
}

.welcome-card small{
  display:block;
  color:#777;
  margin-top:4px;
}


/* CREATE POST */

.create-post{
  background:white;
  padding:15px;
  border-radius:15px;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
}

.create-post textarea{
  width:100%;
  min-height:90px;
  border:1px solid #ddd;
  border-radius:10px;
  padding:12px;
  resize:none;
  outline:none;
  font-size:15px;
}

.post-tools{
  margin-top:12px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.photo-btn{
  background:#eee;
  padding:10px 14px;
  border-radius:8px;
  cursor:pointer;
  color:#444;
}

.photo-btn input{
  display:none;
}

.post-tools button{
  background:#6c2cff;
  color:white;
  padding:10px 20px;
  border-radius:8px;
  font-weight:bold;
}

#imagePreview img{
  max-width:100%;
  max-height:300px;
  margin-top:12px;
  border-radius:12px;
}


/* FEED */

.feed-title{
  margin:25px 0 12px;
}

.post{
  background:white;
  border-radius:15px;
  padding:15px;
  margin-bottom:15px;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
}

.post-header{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:12px;
}

.post-user{
  font-weight:bold;
}

.post-time{
  color:#888;
  font-size:12px;
  margin-top:3px;
}

.post-content{
  line-height:1.5;
  margin-bottom:10px;
  white-space:pre-wrap;
}

.post-image{
  width:100%;
  max-height:500px;
  object-fit:cover;
  border-radius:12px;
  margin-top:8px;
}

.post-actions{
  display:flex;
  gap:8px;
  border-top:1px solid #eee;
  margin-top:12px;
  padding-top:10px;
}

.post-actions button{
  flex:1;
  padding:10px;
  background:#f2f2f2;
  border-radius:8px;
}

.post-actions button.liked{
  color:#ff1744;
}


/* MODAL */

.modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);
  display:flex;
  justify-content:center;
  align-items:center;
  padding:20px;
  z-index:100;
}

.modal-box{
  background:white;
  width:100%;
  max-width:380px;
  border-radius:20px;
  padding:30px;
  text-align:center;
  position:relative;
}

.close{
  position:absolute;
  right:15px;
  top:15px;
  background:#eee;
  width:35px;
  height:35px;
  border-radius:50%;
}

.big-avatar{
  width:90px;
  height:90px;
  margin:10px auto 15px;
  font-size:35px;
}

.modal-box button:last-child{
  margin-top:20px;
  padding:12px 30px;
  background:#6c2cff;
  color:white;
  border-radius:8px;
}


/* MOBILE */

@media(max-width:500px){

  .topbar{
    padding:0 12px;
  }

  .brand{
    font-size:22px;
  }

  .top-actions button{
    padding:8px;
  }

  .container{
    padding:12px 10px 40px;
  }

  .auth-box{
    padding:30px 20px;
  }

    }
