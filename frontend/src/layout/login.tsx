import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function Login() {
    const login = (e:any) => {
        e.preventDefault();
        const id = e.target.id.value;
        const password = e.target.password.value;
        fetch(`http://localhost:8080/login_ok`, {
            method: 'POST',
            body: JSON.stringify({id: id, password: password}),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            if(data.success){
                alert(data.message);
                window.location.href = '/home';
            }else{
                alert(data.message);
            }
        });
    }
    return (
        <div className='Login'>
                    <h1>로그인</h1>
                <br /><form onSubmit={login}>
                <input type="text" placeholder="아이디" name="id" />
                <input type="password" placeholder="비밀번호" name="password" />
                <button type="submit" >로그인</button>
            </form>
        </div>
    )
}

export default Login;
