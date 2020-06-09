package ua.edu.lnu.schedule.models.viewmodels;

public class ChangePasswordModel {
	private String oldPassword;
	private String newPassword;
	
	public String getOldPassword() {
		return oldPassword;
	}
	
	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}
	
	public String getNewPassword() {
		return newPassword;
	}
	
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
}
