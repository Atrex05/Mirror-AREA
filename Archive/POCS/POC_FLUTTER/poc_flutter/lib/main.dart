import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String username = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(username.isEmpty ? 'Welcome' : 'Welcome $username'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            final result = await Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const LoginPage()),
            );
            if (result != null && result is String) {
              setState(() {
                username = result;
              });
            }
          },
          child: const Text('Login'),
        ),
      ),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String? _errorMessage;

  Future<bool> handleLogin(String username, String password) async {
    try {
      return await connected(username, password);
    } catch (error) {
      print("Error during login: $error");
      return false;
    }
  }

  Future<bool> connected(String user, String pass) async {
    const url = 'http://127.0.0.1:8080/login';
    final requestOptions = {
      'username': user,
      'password': pass
    };

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: { "Content-Type": "application/json" },
        body: json.encode(requestOptions),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to login');
      }

      final data = json.decode(response.body);
      return data['message'] == "Login successful";
    } catch (error) {
      print("API error: $error");
      return false;
    }
  }

  void _login() async {
    final username = _usernameController.text;
    final password = _passwordController.text;

    final success = await handleLogin(username, password);

    if (success) {
      Navigator.pop(context, username);
    } else {
      setState(() {
        _errorMessage = 'Login failed. Please check your credentials.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login Page'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (_errorMessage != null)
              Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            TextField(
              controller: _usernameController,
              decoration: const InputDecoration(labelText: 'Username'),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _login,
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
