<template>
		<div>
			<h1>LOGIN</h1>
				<v-form v-model="formValid" class="mt-5 mb-5">
					<v-container>
							<v-row>
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
										<v-btn
											color="primary"
											@click="login()"
											:disabled="!formValid"
										>
											Login
										</v-btn>
									</v-col>

							</v-row>
					</v-container>
			</v-form>

			Belum Punya Akun ?
			<section>
				<v-btn
				to="/register"
			>
				Daftar
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
	name: 'loginPage',
	data: function() {
		return {
			snackbarObject: {
				status: false,
				color: 'success',
				messages: '',
			},
			dialogLoading: false,
			formValid: true,
			userObject: {
				password: '',
				email: '',
			},
			showPassword: false,
			emailRules: [
					v => !!v || 'E-mail is required',
					v => /.+@.+/.test(v) || 'E-mail must be valid',
			],
			passwordRules: [
				v => !!v || 'Required.',
				v => v.length >= 8 || 'Min 8 characters',
			]
		}
	},
	methods: {
		async login() {
			this.dialogLoading = true

			try {
				const response = await Axios.post('http://localhost:8000/api/login', this.userObject)

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
				this.snackbarObject.messages = error.response.data.message
			}
		}
	}
}
</script>

<style>

</style>