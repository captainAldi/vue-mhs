<template>
		<div>
			<h1>REGISTER</h1>

				<!-- Alert Jika Gagal -->
				<v-alert 
					:type="alertObject.type"
					v-model="alertObject.status"
					dismissible
					>
							<li
								v-for="(value, key) of alertObject.message"
								:key="key"
							>
								<strong>{{key}}</strong> : <template v-for="item in value"> {{item}} </template>
							</li>
				</v-alert>

				<v-form v-model="formValid" class="mt-5 mb-5">
					<v-container>
							<v-row>
									<v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="userObject.name"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>
        </v-col>

									<v-col
											cols="12"
											md="4"
									>
											<v-text-field
													v-model="userObject.email"
													:rules="emailRules"
													label="E-mail"
													required
											></v-text-field>
									</v-col>

									<v-col
											cols="12"
											md="4"
									>
											<v-text-field
													v-model="userObject.password"
													:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
													:rules="passwordRules"
													:type="showPassword ? 'text' : 'password'"
													@click:append="showPassword = !showPassword"
													label="Password"
													hint="Min 8 Character"
													required
											></v-text-field>
									</v-col>

									<v-col
											cols="12"
											md="4"
									>
											<v-text-field
													v-model="userObject.c_password"
													:append-icon="showc_password ? 'mdi-eye' : 'mdi-eye-off'"
													:rules="c_passwordRules"
													:type="showc_password ? 'text' : 'password'"
													@click:append="showc_password = !showc_password"
													label="Confirm Password"
													:hint="c_passwordRules ? 'Matched' : 'Min 8 Character'"
													required
											></v-text-field>
									</v-col>

									<v-col
										cols="12"
										md="4"
									>
										<v-btn
											color="primary"
											@click="register()"
											:disabled="!formValid"
										>
											Register
										</v-btn>
									</v-col>

							</v-row>
					</v-container>
			</v-form>

			Sudah Punya Akun ?
			<section>
				<v-btn
				to="/login"
			>
				Login
			</v-btn>
			</section>

			<!-- snackbar message-->

				<v-snackbar
      v-model="snackbarObject.status"
						:top="true"
						:right="true"
						:color="snackbarObject.color"
						:multi-line="false"
    >
      {{ snackbarObject.messages }}
      <v-btn
        text
        @click="snackbarObject.status = false"
      >
        Close
      </v-btn>
    </v-snackbar>

			<!-- Dialog Loading -->
		<v-dialog
      v-model="dialogLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
		</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'registerPage',
	data: function() {
		return {
			snackbarObject: {
				status: false,
				color: 'success',
				messages: '',
			},
			alertObject: {
				type: 'success',
				message: '',
				status: false
			},
			dialogLoading: false,
			formValid: true,
			userObject: {
				password: '',
				email: '',
				c_password: '',
				name: ''
			},
			showPassword: false,
			showc_password: false,
			emailRules: [
					v => !!v || 'E-mail is required',
					v => /.+@.+/.test(v) || 'E-mail must be valid',
			],
			passwordRules: [
				v => !!v || 'Required.',
				v => v.length >= 8 || 'Min 8 characters',
			],
			c_passwordRules: [
				v => !!v || 'Required.',
				v => v.length >= 8 || 'Min 8 characters',
				v => (!!v && v) === this.userObject.password || 'Values do not match'
			],
			nameRules: [
				v => !!v || 'Required.',
			]
		}
	},
	methods: {
		async register() {
			this.dialogLoading = true

			try {
				const response = await Axios.post('http://localhost:8000/api/register', this.userObject)

				if(response.data.success == true) {
					let userLogedIn = {
						nama: response.data.data.name,
						id: response.data.data.id,
						email: response.data.data.email,
						token: response.data.data.token
					}

					localStorage.setItem('storeObjUser', JSON.stringify(userLogedIn))
					this.dialogLoading = false
					if(this.$route.path !== '/mahasiswa') this.$router.push('/mahasiswa')
				}

			} catch (error) {
				this.dialogLoading = false
				this.snackbarObject.status = true
				this.snackbarObject.color = 'error'

				if(!error.response) {
					this.snackbarObject.messages = 'No Response from Server'
				} else {
					this.snackbarObject.messages = error.response.data.message
					this.alertObject.message = error.response.data.data
					this.alertObject.type = 'error'
					this.alertObject.status = true
				}

				
			}
		},
		login() {
			this.$router.push('/login')
		}
	}
}
</script>

<style>

</style>