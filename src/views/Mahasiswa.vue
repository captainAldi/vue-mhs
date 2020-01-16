<template>
  <div>

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

			<center><h1>DATA MAHASISWA</h1></center>

		<!-- Loading Jika Table Belum Selesai di Load -->
	
			<v-skeleton-loader
					class="mx-auto"
					type="table"
					v-if="!dataMahasiswa.length"
			></v-skeleton-loader>

			<!-- Tampilkan Table Setelah Selesai di Load -->

			<v-data-table
    :headers="headers"
    :items="dataMahasiswa"
				:search="search"
    sort-by="calories"
    class="elevation-1"
				v-else
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>

								<v-text-field
									v-model="search"
									append-icon="mdi-magnify"
									label="Search"
									single-line
									hide-details
							></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nim" label="NIM"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-trash-can
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchDataMahasiswa">Reset</v-btn>
    </template>
  </v-data-table>

		<!-- tombol logout -->
		<section>
			<v-btn
				@click="logout()"
				color="error"
			>
				Logout
			</v-btn>
		</section>


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
		</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'pageMahasiswa',
	data: () => ({
						search: '',
      dialog: false,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id',
        },
        { text: 'Nama', value: 'nama' },
        { text: 'NIM', value: 'nim' },
								{ text: 'Actions', value: 'action', sortable: false },
      ],
      dataMahasiswa: [],
						dialogLoading: false,
      editedIndex: -1,
      editedItem: {
        nama: '',
        nim: '',
      },
      defaultItem: {
        nama: '',
        nim: '',
      },
						snackbarObject: {
							status: false,
							color: 'success',
							messages: '',
						},
						alertObject: {
							type: 'success',
							message: '',
							status: false
						}
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.fetchDataMahasiswa()
    },

    methods: {
						async fetchDataMahasiswa(){
						
						let config = {
							headers: {
								Accept: 'application/json',
								Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('storeObjUser')).token,
							}
						}

							try {
								const response = await Axios.get('http://localhost:8000/api/mahasiswa/', config)
								
								if(response.data.success == true) {
									this.dataMahasiswa = response.data.data
								}
							} catch (error) {
								this.snackbarObject.status = true
								this.snackbarObject.color = 'error'
								this.snackbarObject.message = error.response.data.message
							}

						},

      editItem (item) {
        this.editedIndex = this.dataMahasiswa.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async deleteItem (item) {			
        
        let dialogConfirm = confirm('Are you sure you want to delete this item?')

								if(dialogConfirm == true) {

									let config = {
										headers: {
											Accept: 'application/json',
											Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('storeObjUser')).token,
										}
									}

									try {
										this.dialogLoading = true
										const response = await Axios.delete('http://localhost:8000/api/mahasiswa/'+item.id, config)
										
										if(response.data.success == true) {
											this.fetchDataMahasiswa()
											this.dialogLoading = false
											this.snackbarObject.status = true
											this.snackbarObject.messages = 'Berhasil di delete'
										}
									} catch (error) {
											this.dialogLoading = false
											this.snackbarObject.status = true
											this.snackbarObject.color = 'error'
											this.snackbarObject.message = error.response.data.message
									}  
								}

      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async save () {
							
        if (this.editedIndex > -1) {

										try {
											let formDataMahasiswa = {
												nama: this.editedItem.nama,
												nim: this.editedItem.nim
											}

											let config = {
												headers: {
													Accept: 'application/json',
													Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('storeObjUser')).token,
												}
											}

											this.dialogLoading = true
											const response = await Axios.put('http://localhost:8000/api/mahasiswa/'+this.editedItem.id, formDataMahasiswa, config)		
													
											if(response.data.success == true) {
												this.fetchDataMahasiswa()
												this.dialogLoading = false
												this.snackbarObject.status = true
												this.snackbarObject.color = 'success'
												this.snackbarObject.messages = response.data.message
											}	
										} catch (error) {
												this.dialogLoading = false
												this.snackbarObject.status = true
												this.snackbarObject.color = 'error'
												this.snackbarObject.messages = error.response.data.message

												this.alertObject.type = 'error'
												this.alertObject.message = error.response.data.data
												this.alertObject.status = true
												
										}
       
        } else {

									try {
										let formDataMahasiswa = {
											nama: this.editedItem.nama,
											nim: this.editedItem.nim
										}

										let config = {
											headers: {
												Accept: 'application/json',
												Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('storeObjUser')).token,
											}
										}
										this.dialogLoading = true
										const response = await Axios.post('http://localhost:8000/api/mahasiswa/', formDataMahasiswa, config)
										
										if(response.data.success == true) {
											this.fetchDataMahasiswa()
											this.dialogLoading = false
											this.snackbarObject.status = true
											this.snackbarObject.color = 'success'
											this.snackbarObject.messages = response.data.message
										}
									} catch (error) {
										this.dialogLoading = false
											this.snackbarObject.status = true
											this.snackbarObject.color = 'error'
											this.snackbarObject.messages = error.response.data.message
											
											this.alertObject.type = 'error'
											this.alertObject.message = error.response.data.data
											this.alertObject.status = true
										}
        }
        this.close()
      },

						logout() {
							localStorage.clear()

							this.$router.push('/')
						}
    },
}
</script>

<style>

</style>