import React, { useState, Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import AuthContext from '../components/context/AuthContext';
import { orderApi } from '../components/misc/OrderApi';
import { parseJwt, handleLogError } from '../components/misc/Helpers';
import { Button, Label, Input, Textarea, HelperText, Select, Modal, ModalBody, ModalFooter, ModalHeader } from '@windmill/react-ui';
import Logo from '../assets/img/logo-white-frame.png';
import "../assets/css/input-fields-container.css";
import { citiesInBulgaria } from '../cities/citiesData';
import { Link } from 'react-router-dom';

class SignUp extends Component {
  static contextType = AuthContext;

  state = {
    username: '',
    password: '',
    email: '',
    companyAddress: '',
    communicationName: '',
    phone: '',
    companyName: '',
    bulstat: '',
    city: '',
    isDdsRegistered: false,
    mol: '',
    postCode: null,
    orderAddress: '',
    isLoggedIn: false,
    isError: false,
    errorMessage: '',
    showModal: false,
  };

  componentDidMount() {
    const Auth = this.context;
    const isLoggedIn = Auth.userIsAuthenticated();
    this.setState({ isLoggedIn });
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  validatePasswords = () => {
    const { password, 'confirm-password': confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({
        isError: true,
        passwordErrorMessage: 'Паролите не съвпадат!',
      });
    } else {
      this.setState({
        isError: false,
        passwordErrorMessage: '',
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      username,
      password,
      email,
      companyAddress,
      communicationName,
      phone,
      companyName,
      bulstat,
      city,
      isDdsRegistered,
      mol,
      postCode,
      orderAddress,
    } = this.state;
    console.log(username,
      password,
      email,
      companyAddress,
      communicationName,
      phone,
      companyName,
      bulstat,
      city,
      mol,
      postCode, orderAddress);
    if (
      !(
        username &&
        password &&
        email &&
        companyAddress &&
        communicationName &&
        phone &&
        companyName &&
        bulstat &&
        city &&
        mol &&
        postCode &&
        orderAddress
      )
    ) {
      this.setState({
        isError: true,
        errorMessage: 'Моля попълнете всички задължителни полета !',
      });
      return;
    }
    if (password !== this.state['confirm-password']) {
      this.setState({
        isError: true,
        passwordErrorMessage: 'Паролите не съвпадат!',
      });
      return;
    }
    const user = {
      username,
      password,
      email,
      companyAddress,
      communicationName,
      phone,
      companyName,
      bulstat,
      city,
      mol,
      postCode,
      orderAddress,
    };
    console.log(user);

    orderApi.signup(user)
      .then(response => {
        const { accessToken } = response.data;
        const data = parseJwt(accessToken);

        this.setState({
          showModal: true,
        });
      })
      .catch(error => {
        handleLogError(error);
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          let errorMessage = 'Invalid fields';
          if (errorData.status === 409) {
            errorMessage = errorData.message;
          } else if (errorData.status === 400) {
            errorMessage = errorData.errors[0].defaultMessage;
          }
          this.setState({
            isError: true,
            errorMessage,
          });
        }
      });
  }

  handleModalClose = () => {
    this.setState({ showModal: false });
  }

  handleRedirectToLogin = () => {
    this.props.history.push('/login');
  }

  render() {
    const { isLoggedIn, isError, errorMessage, passwordErrorMessage, showModal } = this.state;

    if (isLoggedIn) {
      return <Redirect to='/app' />;
    } else {
      return (
        <div className="flex items-center p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 h-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <div className="flex flex-col md:flex-row">
              <div className="h-1 w-auto md:h-auto md:w-1/2 ml-4">
                <img
                  aria-hidden="true"
                  className="object-contain h-full  w-full dark:hidden"
                  src={Logo}
                  alt="Logo"
                />
              </div>
              <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
                <div className="h-full w-full">
                  <HelperText>Полетата отбелязани със <span style={{ color: 'red' }}>*</span> са задължителни </HelperText>
                  <hr className="my-8" />
                  <div className='input-fields-container'>
                    <div className="grid grid-cols-1 gap-1">
                      <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Потребителски данни
                      </h1>
                      <Label>
                        <span>Име</span>
                        <Input
                          className="mt-1"
                          name="communicationName"
                          placeholder="Ще бъде използвано за персонална комуникация"
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      <Label>
                        <span>Потребителско име</span>
                        <HelperText valid={false}> *</HelperText>

                        <Input
                          className="mt-1"
                          name="username"
                          placeholder="Потребителско име"
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      <Label>
                        <span>Email</span>
                        <Input
                          className="mt-1"
                          type="email"
                          placeholder="example@email.com"
                          name="email"
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      <Label>
                        <span>Вашата парола</span>
                        <Input
                          className="mt-1"
                          placeholder="***************"
                          type="password"
                          name="password"
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      <Label>
                        <span>Потвърдете паролата</span>
                        <Input
                          className="mt-1"
                          placeholder="***************"
                          type="password"
                          name="confirm-password"
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      {passwordErrorMessage}
                      <hr className="my-8" />
                      <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Фирмени/Лични данни
                      </h1>
                      <Label>
                        <span>Фирма/Име</span>
                        <Input
                          className="mt-1"
                          name="companyName"
                          placeholder=""
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      <Label>
                        <span>Булстат/ЕГН</span>
                        <Input
                          className="mt-1"
                          name="bulstat"
                          placeholder="Булстат/ЕГН"
                          onChange={this.handleInputChange}
                        />
                      </Label>

                      <Label>
                        <span>Град</span>

                        <Select
                          className="mt-1"
                          name="city"
                          placeholder="Град"
                          onChange={this.handleInputChange}
                        >{citiesInBulgaria.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}</Select>
                      </Label>
                      <Label>
                        <span>МОЛ</span>
                        <Input
                          className="mt-1"
                          name="mol"
                          placeholder="МОЛ"
                          onChange={this.handleInputChange}
                        />
                      </Label>

                      <Label>
                        <span>Пощенски код</span>
                        <Input
                          className="mt-1"
                          name="postCode"
                          placeholder="Пощенски код"
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      <Label>
                        <span>Адрес</span>
                        <Textarea
                          className="mt-1"
                          name="companyAddress"
                          placeholder="Адрес"
                          onChange={this.handleInputChange}
                        />
                      </Label>

                      <Label>
                        <span>Телефон</span>
                        <Input
                          className="mt-1"
                          name="phone"
                          placeholder="Телефон"
                          onChange={this.handleInputChange}
                        />
                      </Label>

                      <Label>
                        <Input type="checkbox"
                          name="isDdsRegistered"
                          onChange={this.handleInputChange}
                        />
                        <span className="ml-2">Регистрация по ДДС</span>

                      </Label>

                      <Label>
                        <hr className="my-8" />

                        <span>Адрес за доставка</span>
                        <Input
                          className="mt-1"
                          name="orderAddress"
                          placeholder="Адрес за доставка"
                          onChange={this.handleInputChange}
                        />
                      </Label>
                      {/* Add other fields here */}
                    </div>
                    <hr className="my-8" />
                    <p style={{ color: 'ed' }}>{errorMessage}</p>

                    <Button
                      className="mt-4"
                      block
                      onClick={this.handleSubmit}>
                      Регистрация
                    </Button>
                    <Link
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      to="/"
                    >
                      Имате потребител? Влезнете в профила си!
                    </Link>
                  </div>
                </div>
              </main>
            </div>
          </div>

          <Modal isOpen={showModal} onClose={this.handleModalClose}>
            <ModalHeader>Успешна регистрация!</ModalHeader>
            <ModalBody>
              Вашият акаунт е създаден успешно. Ще получите email след като бъде активиран от администратор.
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleRedirectToLogin}>Към началната страница</Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
  }
}

export default SignUp;