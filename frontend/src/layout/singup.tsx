import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function Singup() {
    const singup = async (e:any) => {
        e.preventDefault();
        const name = e.target.name.value;
        const id = e.target.id.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const password_check = e.target.password_check.value;
        if(password !== password_check){
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }else{
            try{
                 const res = await fetch(import.meta.env.API_VALUE+`/singup_ok`, {
            method: 'POST',
            body: JSON.stringify({name: name, id: id, email: email, password: password,password_check:password_check}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
           
        console.log(res.status+"   "+res.ok);
        const data = await res.json();

        if (data.success){
            alert(JSON.stringify(data));

            window.location.href = "/login";
        }else{
            alert(JSON.stringify(data));
        }


        }catch(error){
            console.log(error);
        }
    }
       
    }
    return (
        <div className='Singup auth-wrap'>
            <div className='auth-card'>
                <h1>회원가입</h1>
                <form onSubmit={singup} className='form-stack'>
                    <input className='field' type="text" placeholder="이름" name="name" />
                    <input className='field' type="text" placeholder="아이디" name="id" />
                    <input className='field' type="email" placeholder="이메일" name="email" />
                    <input className='field' type="password" placeholder="비밀번호" name="password" />
                    <input className='field' type="password" placeholder="비밀번호 확인" name="password_check" />
                    <button className='btn btn-primary btn-block' type="submit">회원가입</button>
                </form>
            </div>
        </div>
    )
}

export default Singup;
