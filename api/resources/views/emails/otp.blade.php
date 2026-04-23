<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
        }
        .otp {
            font-size: 28px;
            font-weight: bold;
            color: #2d89ef;
            letter-spacing: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Your OTP Code</h2>

    <p>Use the OTP below to verify your account:</p>

    <div class="otp">
        {{ $otp }}
    </div>

    <p>This code will expire in 5 minutes.</p>

    <div class="footer">
        If you didn’t request this, ignore this email.
    </div>
</div>

</body>
</html>